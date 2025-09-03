import { Response, Request } from "express";

// Initial todos
const todos = [
  { id: 1, title: "Learn Express JS", isCompleted: false },
  { id: 2, title: "Learn React JS", isCompleted: true },
];

// Get all todo
export const getAllTodo = (req: Request, res: Response) => {
  return res.json({
    status: 200,
    msg: "Berhasil mendapatkan list todo",
    data: todos,
  });
};

// Get detail todo
export const getTodoById = (req: Request, res: Response) => {
  const { id } = req.params;

  const data = todos.find((item) => item.id === Number(id));

  if (!data) {
    return res.status(404).send({
      status: 404,
      msg: "Todo tidak ditemukan",
    });
  }

  return res.json({
    status: 200,
    msg: `Berhasil mendapatkan todo dengan id: ${id}`,
    data,
  });
};

// Create todo
export const createTodo = (req: Request, res: Response) => {
  const { title, isCompleted = false } = req.body;

  if (!title) {
    return res.status(400).send({
      status: 400,
      msg: "Title wajib diisi",
    });
  }

  const lastTodo = todos[todos.length - 1];

  const newTodo = { id: lastTodo.id + 1, title, isCompleted };

  todos.push(newTodo);

  return res.json({
    status: 200,
    msg: `Berhasil membuat todo`,
    data: newTodo,
  });
};

// Update todo  
export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, isCompleted } = req.body;

  if (!title) {
    return res.status(400).send({
      status: 400,
      msg: "Title wajib diisi",
    });
  }

  const index = todos.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).send({
      status: 404,
      msg: "Todo tidak ditemukan",
    });
  }

  todos[index] = {
    ...todos[index],
    title,
    isCompleted: isCompleted ?? todos[index].isCompleted,
    // isCompleted: isCompleted ? isCompleted : todos[index].isCompleted
  };

  return res.json({
    status: 200,
    msg: `Berhasil update todo dengan id ${id}`,
    data: todos[index],
  });
};

// Delete todo
export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;

  const index = todos.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).send({
      status: 404,
      msg: "Todo tidak ditemukan",
    });
  }

  const deleted = todos.splice(index, 1);

  return res.json({
    status: 200,
    msg: `Berhasil hapus todo dengan id ${id}`,
    data: deleted[0],
  });
};
