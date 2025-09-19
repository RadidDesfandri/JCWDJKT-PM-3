import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Database } from "../config/prisma";
import { xenditInvoiceClient } from "../libs/xenditClient";

class InvoiceController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new Database().getInstance();
  }

  public create = async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;

      if (!amount) {
        return res.status(400).send({
          status: 400,
          msg: "Amount wajib diisi",
        });
      }

      const BASE_WEB_URL = process.env.BASE_WEB_URL || "http://localhost:3000";

      const transaction = await this.prisma.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            amount,
            user: {
              connect: { id: req.user?.id },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        const invoiceResponse = await xenditInvoiceClient.createInvoice({
          data: {
            amount,
            externalId: newInvoice.id,
            payerEmail: newInvoice.user.email,
            description: `Pembelian langganan dari ${
              newInvoice.user.name
            } dengan nominal ${newInvoice.amount.toLocaleString("id-ID")}`,
            successRedirectUrl: `${BASE_WEB_URL}/invoice-status?success=${newInvoice.id}`,
            failureRedirectUrl: `${BASE_WEB_URL}/invoice-status?failure=${newInvoice.id}`,
            // set expired
            invoiceDuration: 50,
          },
        });

        if (!invoiceResponse.id && !invoiceResponse.invoiceUrl) {
          return res.status(400).send({
            status: 400,
            msg: "Error xendit. Id dan invoiceUrl harus ada",
          });
        }

        await tx.invoice.update({
          where: { id: newInvoice.id },
          data: {
            externalId: invoiceResponse.externalId,
            paymentUrl: invoiceResponse.invoiceUrl,
            description: invoiceResponse.description,
          },
        });

        return invoiceResponse.invoiceUrl;
      });

      return res.json({
        status: 200,
        msg: "Success",
        paymentUrl: transaction,
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };

  public webhook = async (req: Request, res: Response) => {
    try {
      const { external_id, status } = req.body;

      switch (status) {
        case "PAID":
          await this.prisma.invoice.update({
            where: { id: external_id },
            data: {
              status: "PAID",
            },
          });
          break;

        case "EXPIRED":
          await this.prisma.invoice.update({
            where: { id: external_id },
            data: {
              status: "FAILED",
            },
          });
          break;
      }

      return res.json({
        status: 200,
        msg: "Trigger webhook",
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send({
        status: 500,
        msg: `Error: ${error}`,
      });
    }
  };
}

export default InvoiceController;
