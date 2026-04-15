export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const STORAGE_KEY = "todos";
