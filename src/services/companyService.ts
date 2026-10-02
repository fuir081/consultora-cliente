// Ajusta la URL base según cómo tengas configurado tu proyecto
const API_URL =
  (
    globalThis as typeof globalThis & {
      process?: { env?: { NEXT_PUBLIC_API_URL?: string } };
    }
  ).process?.env?.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const companyService = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}` // Descomenta si usas JWT
        },
      });

      if (!response.ok) throw new Error("Error al obtener empresas");

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  create: async (data: {
    razonSocial: string;
    rut: string;
    megaNodeId?: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al crear empresa");

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  update: async (
    id: string,
    data: Partial<{ razonSocial: string; rut: string; megaNodeId: string }>,
  ) => {
    try {
      const response = await fetch(`${API_URL}/companies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al actualizar empresa");

      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  remove: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/companies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar empresa");

      // Como el backend no devuelve un JSON (devuelve vacío),
      // simplemente retornamos true indicando que todo salió bien.
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
