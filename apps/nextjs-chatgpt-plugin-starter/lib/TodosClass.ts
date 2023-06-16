import { components } from "../schema";

type Todo = components["schemas"]["Todo"];
type TodoList = components["schemas"]["TodoList"];

class TodosClass {
  todos: TodoList["todos"] = [];
  createTodo = (todo: Todo) => {
    this.todos = [...(this?.todos as any), todo];
  };
  getTodos(): TodoList {
    const todos = this.todos;
    return { todos };
  }
  deleteTodo(todo: Todo): void {
    const index = this?.todos?.findIndex((x: any) => x?.todo === x?.todo);
    this?.todos?.splice(index as any, 1);
  }
}

const Todos = new TodosClass();

export { Todos };
