import { Request, Response } from "express";
import { db } from "../config/db";
import { parseArgs } from "util";

class ExepenseControllerV2 {
  // Get all
  public all = async (req: Request, res: Response) => {
    const query = await db.getPool().query(`SELECT * FROM expenses`);

    return res.json({
      status: 200,
      data: query.rows,
    });
  };

  // Detail
  public detail = async (req: Request, res: Response) => {
    const query = await db
      .getPool()
      .query(`SELECT * FROM expenses WHERE id = $1`, [req.params.id]);
    //  .query(`SELECT * FROM expenses WHERE id = ${req.params.id}`); -> Tidak aman dari SQL Injection

    if (query.rowCount === 0) {
      return res.status(404).send({
        status: 404,
        msg: "Data tidak ditemukan",
      });
    }

    return res.json({
      status: 200,
      data: query.rows[0],
    });
  };

  // Buat data baru
  public create = async (req: Request, res: Response) => {
    const { title, nominal, type, category, date } = req.body;

    if (!title || !nominal || !type || !category || !date) {
      return res.status(400).send({
        status: 400,
        msg: "Title, Nominal, Type, Category, dan Date wajib diisi",
      });
    }

    const query = await db.getPool().query(
      `
        INSERT INTO expenses 
        (title, nominal, type, category, date) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
      [title, nominal, type, category, date]
    );

    return res.json({
      status: 200,
      msg: "Berhasil membuat data baru",
      data: query.rows[0],
    });
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { title, nominal, type, category, date } = req.body;

    const query = await db.getPool().query(
      // Gunakan coalesce agar bisa kirim beberapa data
      `UPDATE expenses 
        SET title = COALESCE($1, title), 
        nominal= COALESCE($2, nominal), 
        type = COALESCE($3, type),
        category = COALESCE($4, category), 
        date = COALESCE($5, date)
        WHERE id = $6 RETURNING *`,
      [
        title ?? null,
        nominal ?? null,
        type ?? null,
        category ?? null,
        date ?? null,
        id,
      ]
    );

    // Jika data tidak ditemukan
    if (query.rowCount === 0) {
      return res.status(404).send({
        status: 404,
        msg: "Data tidak ditemukan",
      });
    }

    return res.json({
      status: 200,
      msg: "Berhasil ubah data",
      data: query.rows[0],
    });
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    const query = await db
      .getPool()
      .query(`DELETE FROM expenses WHERE id = $1 RETURNING *`, [id]);

    // Jika data tidak ditemukan
    if (query.rowCount === 0) {
      return res.status(404).send({
        status: 404,
        msg: "Data tidak ditemukan",
      });
    }

    return res.json({
      status: 200,
      msg: "Berhasil hapus data",
      data: query.rows[0],
    });
  };

  // Get total bt date range
  public getTotalByDateRange = async (req: Request, res: Response) => {
    const { start_date, end_date, type } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).send({
        status: 400,
        msg: "start_date dan end_date wajib diisi",
      });
    }

    let query = `
        SELECT 
        type, 
        SUM(nominal::numeric) as total_amount, 
        COUNT(*) as total_transactions 
        FROM expenses WHERE date >= $1 AND date <= $2`;

    let params = [start_date, end_date];

    if ((type && type === "income") || type === "expense") {
      query += ` AND type ILIKE $3`;
      params.push(type);
    }

    query += ` GROUP BY type ORDER BY type`;

    const result = await db.getPool().query(query, params);

    let totalIncome = 0;
    let totalExpense = 0;
    let grandTotal = 0;

    result.rows.forEach((row) => {
      if (row.type === "income") {
        totalIncome = parseFloat(row.total_amount);
      } else if (row.type === "expense") {
        totalExpense = parseFloat(row.total_amount);
      }
    });

    grandTotal = totalIncome - totalExpense;

    return res.json({
      status: 200,
      data: {
        date_range: {
          start_date,
          end_date,
        },
        summary: {
          total_income: totalIncome,
          total_expense: totalExpense,
          balance: grandTotal,
        },
      },
    });
  };

  // Get total by category
  public getTotalByCategory = async (req: Request, res: Response) => {
    const { category } = req.query;

    const result = await db.getPool().query(
      ` SELECT 
        category, 
        type,
        SUM(nominal::numeric) as total_amount
        FROM expenses
        WHERE category = $1
        GROUP BY category, type ORDER BY category, type
        `,
      [category ?? "salary"]
    );

    let totalIncome = 0;
    let totalExpense = 0;
    let grandTotal = 0;

    result.rows.forEach((row) => {
      const amount = parseFloat(row.total_amount);

      if (row.type === "income") {
        totalIncome += amount;
      } else if (row.type === "expense") {
        totalExpense += amount;
      }
    });

    grandTotal = totalIncome - totalExpense;

    return res.json({
      status: 200,
      data: {
        summary: {
          total_income: totalIncome,
          total_expense: totalExpense,
          balance: grandTotal,
        },
        categories: result.rows,
      },
    });
  };
}

export default ExepenseControllerV2;
