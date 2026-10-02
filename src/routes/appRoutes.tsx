import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Documentos from "@/pages/documentos/Documentos";
import Login from "@/pages/login/login";
import RecoverPassword from "@/pages/forgotPass/forgotPass";
import Dashboard from "@/pages/dashboard/dashboard";
import Usuarios from "@/pages/usuarios/usuarios";
import Perfil from "@/pages/perfil/perfil";
import Configuracion from "@/pages/configuracion/configuracion";
import Formulario from "@/pages/formularios/formularios";
import Productos from "@/pages/productos/productos";
import Proveedores from "@/pages/proveedores/proveedores";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/recuperar-clave" element={<RecoverPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/documentos" element={<Documentos />} />

        <Route path="/productos" element={<Productos />} />

        <Route path="/usuarios" element={<Usuarios />} />

        <Route path="/perfil" element={<Perfil />} />

        <Route path="/configuracion" element={<Configuracion />} />

        <Route path="/formularios" element={<Formulario />} />

        <Route path="/proveedores" element={<Proveedores />} />
      </Routes>
    </BrowserRouter>
  );
}
