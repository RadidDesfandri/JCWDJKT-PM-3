import { Xendit, Invoice as InvoiceClient } from "xendit-node";

const XENDIT_API_KEY = process.env.XENDIT_API_KEY || "";

const xenditClient = new Xendit({
  secretKey: XENDIT_API_KEY,
});

export const { Invoice } = xenditClient;

export const xenditInvoiceClient = new InvoiceClient({
  secretKey: XENDIT_API_KEY,
});
