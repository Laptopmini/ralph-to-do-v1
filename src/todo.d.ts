export interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

export declare const STORAGE_KEY: string;

export declare function loadTodos(): Todo[];
export declare function saveTodos(todos: Todo[]): void;
export declare function addTodo(todos: Todo[], text: string): Todo[];
export declare function toggleTodo(todos: Todo[], id: string): Todo[];
export declare function deleteTodo(todos: Todo[], id: string): Todo[];
