"use client";

import {
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  ListTodo,
  Loader2,
  Plus,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import todoService from "@/services/todoService";
import { useRouter } from "next/navigation";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const loadTodos = useCallback(async (force = false) => {
    try {
      const response = await todoService.getTodo({ page: 1, limit: 10 }, force);
      const todosData = response.data?.todos?.todos || [];
      setTodos(todosData);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleCreateOrUpdate = async () => {
    if (!formData.title.trim()) return;

    try {
      if (editingTodo) {
        await todoService.updateTodo({
          id: editingTodo.id,
          title: formData.title,
          description: formData.description,
          status: editingTodo.status,
        });
      } else {
        await todoService.createTodo(formData);
      }

      setShowModal(false);
      setFormData({ title: "", description: "" });
      setEditingTodo(null);

      setLoading(true);
      await loadTodos(true);
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await todoService.deleteTodo(id);
      setLoading(true);
      await loadTodos(true);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStatusChange = async (todo: Todo, newStatus: Todo["status"]) => {
    try {
      await todoService.updateTodo({
        id: todo.id,
        title: todo.title,
        description: todo.description,
        status: newStatus,
      });

      setLoading(true);
      await loadTodos(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({ title: todo.title, description: todo.description });
    setShowModal(true);
  };

  const getStatusIcon = (status: Todo["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: Todo["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 border-green-500/50 text-green-400";
      case "CANCELLED":
        return "bg-red-500/10 border-red-500/50 text-red-400";
      default:
        return "bg-yellow-500/10 border-yellow-500/50 text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-cyan-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-pink-500 to-cyan-500 flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Todos</h1>
                <p className="text-gray-400 text-sm">
                  Manage your tasks efficiently
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTodo(null);
                setFormData({ title: "", description: "" });
                setShowModal(true);
              }}
              className="px-6 py-3 bg-linear-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Todo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {todos.filter((t) => t.status === "PENDING").length}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {todos.filter((t) => t.status === "COMPLETED").length}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-gray-400 text-sm">Cancelled</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {todos.filter((t) => t.status === "CANCELLED").length}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-5 hover:border-pink-500/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(todo.status)}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditModal(todo)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                      aria-label="Edit todo"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition"
                      aria-label="Delete todo"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {todo.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {todo.description}
                </p>

                <div className="flex gap-2">
                  {todo.status !== "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(todo, "COMPLETED")}
                      className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium rounded-lg border border-green-500/50 transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                  {todo.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(todo, "CANCELLED")}
                      className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg border border-red-500/50 transition flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && todos.length === 0 && (
          <div className="text-center py-20">
            <ListTodo className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No todos yet. Create your first one!
            </p>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingTodo ? "Edit Todo" : "Create New Todo"}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="todo-title"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="todo-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter todo title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="todo-description"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="todo-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="Enter todo description"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ title: "", description: "" });
                    setEditingTodo(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateOrUpdate}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition"
                >
                  {editingTodo ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
