import { FormEvent, useEffect, useState } from "react";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  updatedTodo,
} from "../services/todoServices";
import toast from "react-hot-toast";
import { Plus, Save, SquarePen, Trash2, X } from "lucide-react";
import Loader from "../components/Loader";

interface Todo {
  _id: string;
  title: string;
  updatedAt?: string;
}

const FormDatas = () => {
  const [input, setInput] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsFetching(true);
        const response = await getAllTodos();
        setTodos(response.todos || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch todos");
      } finally {
        setIsFetching(false);
      }
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Todo cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await addTodo(input);
      if (response.message) {
        setTodos([
          ...todos,
          {
            _id: response.message._id,
            title: response.message.title,
          },
        ]);
        setInput("");
        toast.success("Todo added successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add todo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully");
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete Todo");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleUpdateTodo = async (id: string) => {
    try {
      if (!editText.trim()) {
        toast.error("Todo title cannot be empty");
        return;
      }

      const result = await updatedTodo(id, editText);
      if (result.success) {
        setTodos(
          todos.map((todo) =>
            todo._id === id
              ? {
                  ...todo,
                  title: editText,
                  updatedAt: new Date().toISOString(),
                }
              : todo
          )
        );
        setEditingId(null);
        toast.success("Todo updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update todo");
    }
  };

  const openDeleteDialog = (id: string) => {
    setTodoToDelete(id);
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setTodoToDelete(null);
    setShowDeleteDialog(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7F9FC] to-[#F6F9FB] text-gray-800 flex flex-col items-center py-8 px-4 sm:px-6 font-sans">
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Are you sure you want to delete this todo?
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => todoToDelete && handleDeleteTodo(todoToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#09090B]">
          Task Manager
        </h1>

        {/* Add Todo Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-md border border-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 ${
              isLoading ? "bg-black" : "bg-[#09090B] hover:bg-[#37373a]"
            } rounded-md font-medium transition-colors disabled:opacity-70 flex items-center justify-center`}
          >
            {isLoading ? <Loader /> : <Plus className="text-white" />}
            <span className="sr-only">Add Todo</span>
          </button>
        </form>

        {/* Todo List Container */}
        <div className="rounded-lg shadow-lg overflow-hidden">
          {isFetching ? (
            <div className="p-6 text-center">
              <Loader />
            </div>
          ) : todos.length > 0 ? (
            <ul className="flex flex-col gap-3 p-3">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="p-4 transition-colors hover:bg-gray-50 rounded-md border border-gray-200"
                >
                  {editingId === todo._id ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black w-full"
                        autoFocus
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleUpdateTodo(todo._id)}
                          className="p-2 text-green-600 hover:bg-gray-200 rounded-md flex-1 sm:flex-none"
                          aria-label="Save"
                        >
                          <Save className="w-5 h-5 text-green-700 mx-auto" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-md flex-1 sm:flex-none"
                          aria-label="Cancel"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{todo.title}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          ID: {todo._id}
                          {todo.updatedAt && (
                            <span className="ml-2 text-green-600">
                              (Edited)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 self-end sm:self-auto">
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                          aria-label="Edit"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(todo._id)}
                          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No todos yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDatas;
