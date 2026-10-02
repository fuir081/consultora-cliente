// src/services/userService.ts

const API_URL = "http://localhost:3000/users"; // Ajusta al puerto de tu backend

// Función auxiliar robusta para obtener los headers con el JWT
const getHeaders = () => {
  // 1. Intentamos buscar el token si lo guardaste directamente como "token"
  let token = localStorage.getItem("token");

  // 2. Si no está, intentamos buscarlo dentro del objeto "user"
  if (!token) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        // Soporta si tu backend lo devuelve como "token" o "access_token"
        token = userObj.token || userObj.access_token;
      } catch (e) {
        console.error("Error parseando el usuario del localStorage", e);
      }
    }
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {
  // Usa GET /users (Ahora con fetch para evitar el error de axios)
  getAll: async () => {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Usa POST /users
  create: async (userData: any) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Usa DELETE /users/:id
  remove: async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return response.json();
  },

  // Usa PATCH /users/:id/role
  updateRole: async (id: string, role: string) => {
    const response = await fetch(`${API_URL}/${id}/role`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return response.json();
  },

  // Usa PATCH /users/:id/status
  updateStatus: async (id: string, isActive: boolean) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return response.json();
  },
};
