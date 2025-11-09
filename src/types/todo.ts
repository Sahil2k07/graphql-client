type TodoQuery = {
  page: number;
  limit: number;
};

type CreateTodoInput = {
  title: string;
  description: string;
};

type UpdateTodoInput = {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
};

type Todo = {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type TodoResponse = {
  todos: {
    totalCount: number;
    page: number;
    limit: number;
    todos: Todo[];
  };
};
