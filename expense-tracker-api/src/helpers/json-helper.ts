import fs from "fs";
import { AllTypeExpense } from "../types/expense-type";

const filepath = "./src/data/expenses.json";

export const readData = (): AllTypeExpense[] => {
  const data = fs.readFileSync(filepath);

  return JSON.parse(data.toString());
};

export const writeData = (data: AllTypeExpense[]) => {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};
