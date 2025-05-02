import { api } from "../api";

export const getAllTodos = async () => {
  try {
    const response = await api.get("/getTodos", { withCredentials: true });
    // console.log(response.data, "getTodos");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch todos");
  }
};

export const addTodo = async (title: string) => {
  try {
    const response = await api.post("/", { title }, { withCredentials: true });
    console.log(response.data, "addTODO"); //
    if (!response.data.success) {
      throw new Error(response.data.message || "Todo failed");
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("todo add error");
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const response = await api.delete(`/${id}`);
    // console.log(response, "res D");
    // console.log(response.data, "res Data");
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("todo add error");
  }
};

export const updatedTodo = async (id: string, title: string) => {
  try {
    // console.log("Updating Todo with ID:", id, "and Title:", title); // Log the ID and title
    const response = await api.put(`/${id}`, { title });
    // console.log(response.data, "updatedTodo");
    return response.data;
  } catch (error: any) {
    console.error("Error updating todo:", error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("todo update error");
  }
};
