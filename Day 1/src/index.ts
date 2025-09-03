import express, { Response, Request, Application } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodo,
  getTodoById,
  updateTodo,
} from "./controllers/todo-controller";

const PORT = 8000;

const app: Application = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send("Welcome");
});

// GET, POST, PUT, PATCH, DELETE

// Method GET -> Untuk mengambil data
app.get("/api", (req: Request, res: Response) => {
  return res.status(200).send({
    status: 200,
    msg: "Response untuk method GET",
  });
});

// Method POST -> Untuk membuat data
app.post("/api", (req: Request, res: Response) => {
  return res.json({
    status: 200,
    msg: `Response untuk method GET, Dengan body ${JSON.stringify(req.body)}`,
  });
});

// Method PUT -> Untuk memperbarui seluruh data
app.put("/api/:id", (req: Request, res: Response) => {
  return res.json({
    status: 200,
    msg: `Response untuk method PUT, Dengan body ${JSON.stringify(
      req.body
    )} dan ID: ${req.params.id}`,
  });
});

// Method PATCH -> Untuk memperbarui sebagian data
app.patch("/api/:id", (req: Request, res: Response) => {
  return res.json({
    status: 200,
    msg: `Response untuk method PATCH, Dengan body ${JSON.stringify(
      req.body
    )} dan ID: ${req.params.id}`,
  });
});

// Menggunakan function terpisah
const deleteData = (req: Request, res: Response) => {
  return res.json({
    status: 200,
    msg: `Response untuk method DELETE sebagai function, Dengan ID: ${req.params.id}`,
  });
};

// Method DELETE -> Untuk menghapus data
app.delete("/api/:id", deleteData);

// Todo route
app.get("/api/todo", getAllTodo);
app.get("/api/todo/:id", getTodoById);
app.post("/api/todo", createTodo);
app.patch("/api/todo/:id", updateTodo);
app.delete("/api/todo/:id", deleteTodo);

app.listen(PORT, () => {
  console.log(`Application run on => http://localhost:${PORT}`);
});
