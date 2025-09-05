import { Request, Response } from "express";
import { readData, writeData } from "../helpers/json-helper";

// Dapatkan seluruh data
export const getAll = (req: Request, res: Response) => {
  const expenses = readData();

  return res.json({
    status: 200,
    data: expenses,
  });
};

// Untuk mendapatkan detail
export const getDetail = (req: Request, res: Response) => {
  const { id } = req.params;

  const expenses = readData();
  const expense = expenses.find((item) => item.id === Number(id));

  if (!expense) {
    return res.status(404).send({
      status: 404,
      msg: "Data tidak ditemukan",
    });
  }

  return res.json({
    status: 200,
    data: expense,
  });
};

// Untuk membuat data baru
export const create = (req: Request, res: Response) => {
  // prettier-ignore
  const { title, nominal, type, category, date = new Date().toISOString() } = req.body;

  if (!title || !nominal || !type || !category) {
    return res.status(400).send({
      status: 400,
      msg: "Title, Nominal, Type, Dan Category wajib diisi",
    });
  }

  const expenses = readData();

  const newId = expenses[expenses.length - 1].id + 1;

  const newExpense = {
    id: newId,
    title,
    nominal,
    type,
    category,
    date,
  };

  expenses.push(newExpense);
  writeData(expenses);

  return res.json({
    status: 200,
    msg: "Berhasil membuat data baru",
    data: newExpense,
  });
};

// Rubah data
export const update = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, nominal, type, category } = req.body;

  const expenses = readData();
  const index = expenses.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).send({
      status: 404,
      msg: "Data tidak ditemukan",
    });
  }

  const nowExpense = expenses[index];

  expenses[index] = {
    ...expenses[index],
    title: title ?? nowExpense.title,
    nominal: nominal ?? nowExpense.nominal,
    type: type ?? nowExpense.type,
    category: category ?? nowExpense.category,
  };

  writeData(expenses);

  return res.json({
    status: 200,
    msg: "Berhasil merubah data",
    data: expenses[index],
  });
};

// Hapus data
export const deleteExpense = (req: Request, res: Response) => {
  const { id } = req.params;

  const expenses = readData();
  const index = expenses.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).send({
      status: 404,
      msg: "Data tidak ditemukan",
    });
  }

  const deleted = expenses.splice(index, 1);
  writeData(expenses);

  return res.json({
    status: 200,
    msg: "Berhasil hapus data",
    data: deleted[0],
  });
};

// Get Total by date range
export const getTotalByDateRange = (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).send({
      status: 400,
      msg: "startDate dan endDate wajib diisi",
    });
  }

  const expenses = readData();
  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });

  let totalIncome = 0;
  let totalExpense = 0;

  filteredExpenses.forEach((expense) => {
    if (expense.type === "income") {
      totalIncome += expense.nominal;
    } else if (expense.type === "expense") {
      totalExpense += expense.nominal;
    }
  });

  return res.json({
    status: 200,
    msg: "Berhasil",
    data: {
      startDate,
      endDate,
      totalIncome,
      totalExpense,
    },
  });
};

// Get total by category
export const getTotalByCategory = (req: Request, res: Response) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).send({
      status: 400,
      msg: "category wajib diisi",
    });
  }

  const expenses = readData();

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.category.toLowerCase() === (category as string).toLowerCase()
  );

  let totalExpense = 0;
  let totalIncome = 0;

  filteredExpenses.forEach((expense) => {
    if (expense.type === "income") {
      totalIncome += expense.nominal;
    } else if (expense.type === "expense") {
      totalExpense += expense.nominal;
    }
  });

  return res.json({
    status: 200,
    msg: "Berhasil",
    data: {
      category,
      totalIncome,
      totalExpense,
    },
  });
};
