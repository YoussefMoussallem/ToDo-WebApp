export interface Todo {
  name: string;
  description: string;
  status: string;
}


const BASE_URL = "/api/method/todo_spa_app.api.todo";

// Wrapper for fetch that handles headers, credentials, and error checking
async function request<T>(method: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE_URL}.${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include", // send Frappe session cookies
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API error", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  const json = await res.json();
  return json.message as T;
}


// Sends request to the server to get all todos for the current user
export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("list_todos");
}

// Sends request to the server to create a new todo with given description and status
export function createTodo(
  description: string,
  status = "Open"
): Promise<Todo> {
  return request<Todo>("create_todo", { description, status });
}

// Sends request to the server to update an existing todo's description and/or status
export function updateTodo(
  name: string,
  fields: Partial<Pick<Todo, "description" | "status">>
): Promise<Todo> {
  return request<Todo>("update_todo", { name, ...fields });
}

// Sends request to the server to delete a todo by name
export function deleteTodo(name: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>("delete_todo", { name });
}
