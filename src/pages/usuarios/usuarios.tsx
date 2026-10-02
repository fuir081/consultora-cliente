import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  Ban,
  Building2,
  Users as UsersIcon,
} from "lucide-react";
import { userService } from "@/services/userService";
// IMPORTANTE: Debes crear este servicio para consumir el endpoint GET /companies
import { companyService } from "@/services/companyService";
// IMPORTANTE: Importa tu servicio de autenticación para saber el rol del usuario logueado
// import { authService } from "@/services/auth.service";

import styles from "./usuarios.module.css";
import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";

interface Empresa {
  id: string;
  razonSocial: string;
  rut: string;
  megaNodeId?: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "SYSADMIN" | "ADMIN" | "USER" | "GUEST";
  estado: "Activo" | "Inactivo";
  ultimoAcceso: string;
  avatarColor: string;
  empresaNombre: string;
  empresaId: string;
}

export default function Usuarios() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"usuarios" | "empresas">(
    "usuarios",
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  // Extraemos el usuario y su rol dinámicamente desde el localStorage
  const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserRole = userStorage.role || "GUEST";

  // Filtros de usuarios
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [alerta, setAlerta] = useState({
    visible: false,
    mensaje: "",
  });

  const avatarColors = [
    "#f472b6",
    "#93c5fd",
    "#fde047",
    "#5eead4",
    "#c084fc",
    "#fb923c",
  ];

  useEffect(() => {
    cargarUsuarios();
    if (currentUserRole === "SYSADMIN") {
      cargarEmpresas();
    }
  }, [currentUserRole]);

  const mostrarAlerta = (mensaje: string) => {
    setAlerta({
      visible: true,
      mensaje,
    });
  };

  const cerrarAlerta = () => {
    setAlerta({
      visible: false,
      mensaje: "",
    });
  };

  // --- CARGA DE DATOS ---
  const cargarUsuarios = async () => {
    try {
      const res = await userService.getAll();

      // Como usamos fetch, 'res' ya es exactamente { success: true, data: [...] }
      if (res.success && res.data) {
        const mapeados = res.data.map((u: any) => ({
          id: u.id,
          nombre: u.name || "Sin Nombre", // Usando u.name según tu JSON
          email: u.email,
          rol: u.role,
          estado: u.isActive ? "Activo" : "Inactivo",
          ultimoAcceso: u.updatedAt
            ? new Date(u.updatedAt).toLocaleDateString()
            : "N/A",
          avatarColor:
            avatarColors[Math.floor(Math.random() * avatarColors.length)],
          empresaNombre: u.company?.razonSocial || "Sin Empresa",
          empresaId: u.company?.id || "",
        }));
        setUsuarios(mapeados);
      }
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    }
  };

  const validarRutFormato = (rut: string) => {
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return regex.test(rut);
  };
  const cargarEmpresas = async () => {
    try {
      const empresasData = await companyService.getAll();

      // Dependiendo de cómo armaste la respuesta en el backend,
      // verificamos si es un arreglo directo o viene dentro de una propiedad 'data'
      const dataToSet = Array.isArray(empresasData)
        ? empresasData
        : empresasData.data;

      if (dataToSet) {
        setEmpresas(dataToSet);
      }
    } catch (error) {
      console.error("Error al cargar empresas", error);
    }
  };

  // --- ESTADOS Y HANDLERS DE USUARIOS ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoRut, setNuevoRut] = useState("");
  const [nuevoPhone, setNuevoPhone] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [nuevoRole, setNuevoRole] = useState("USER");
  const [nuevoCompanyId, setNuevoCompanyId] = useState("");

  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const getIniciales = (nombre: string) => {
    const partes = nombre.trim().split(" ");
    if (partes.length >= 2)
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: nuevoNombre,
        rut: nuevoRut,
        phone: nuevoPhone,
        email: nuevoEmail,
        password: nuevoPassword,
        role: nuevoRole,
      };

      if (
        currentUserRole === "SYSADMIN" &&
        nuevoCompanyId &&
        nuevoCompanyId.trim() !== ""
      ) {
        payload.companyId = nuevoCompanyId;
      }

      await userService.create(payload);
      await cargarUsuarios();

      setNuevoNombre("");
      setNuevoRut("");
      setNuevoPhone("");
      setNuevoEmail("");
      setNuevoPassword("");
      setNuevoRole("USER");
      setNuevoCompanyId("");
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Error creando usuario", error);
      mostrarAlerta("Hubo un error al crear el usuario.");
    }
  };

  const handleOpenEditUser = (usuario: Usuario) => {
    setEditingUser({ ...usuario });
    setIsEditUserModalOpen(true);
  };

  const handleGuardarEdicionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const isActive = editingUser.estado === "Activo";
      await userService.updateRole(editingUser.id, editingUser.rol);
      await userService.updateStatus(editingUser.id, isActive);

      // Si implementas el endpoint para cambiar empresa:
      // if (currentUserRole === "SYSADMIN" && editingUser.empresaId) {
      //   await userService.updateCompany(editingUser.id, editingUser.empresaId);
      // }

      await cargarUsuarios();
      setIsEditUserModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error al actualizar", error);
      mostrarAlerta("Hubo un error al guardar los cambios.");
    }
  };

  const handleDesactivarUser = async (id: string) => {
    if (!window.confirm("¿Desactivar este usuario?")) return;
    try {
      await userService.updateStatus(id, false);
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al desactivar", error);
    }
  };

  const handleEliminarUser = async (id: string) => {
    if (!window.confirm("¿Eliminar usuario permanentemente?")) return;
    try {
      await userService.remove(id);
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideRol = roleFilter === "all" || usuario.rol === roleFilter;
    return coincideBusqueda && coincideRol;
  });

  // --- ESTADOS Y HANDLERS DE EMPRESAS ---
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [nuevaEmpresaNombre, setNuevaEmpresaNombre] = useState("");
  const [nuevaEmpresaRut, setNuevaEmpresaRut] = useState("");
  const [nuevaEmpresaMegaNodeId, setNuevaEmpresaMegaNodeId] = useState("");
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);

  const handleGuardarEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();

    const razonSocial = nuevaEmpresaNombre.trim();
    const rut = nuevaEmpresaRut.trim();
    const megaNodeId = nuevaEmpresaMegaNodeId.trim();

    if (!razonSocial) {
      mostrarAlerta("Debes ingresar la razón social.");
      return;
    }

    if (!rut) {
      mostrarAlerta("Debes ingresar el RUT de la empresa.");
      return;
    }

    if (rut.length > 12) {
      mostrarAlerta("El RUT no puede superar los 12 caracteres.");
      return;
    }

    try {
      const payload = {
        razonSocial,
        rut,
        megaNodeId,
      };

      if (editingCompany) {
        await companyService.update(editingCompany.id, payload);
      } else {
        await companyService.create(payload);
      }

      await cargarEmpresas();
      cerrarModalEmpresa();
    } catch (error: any) {
      console.error("Error guardando empresa", error);

      mostrarAlerta(
        "No se pudo guardar la empresa. Revisa los datos ingresados.",
      );
    }
  };
  const handleOpenEditCompany = (empresa: Empresa) => {
    setEditingCompany(empresa);
    setNuevaEmpresaNombre(empresa.razonSocial);
    setNuevaEmpresaRut(empresa.rut);
    setNuevaEmpresaMegaNodeId(empresa.megaNodeId || ""); // CARGAR DATO
    setIsCompanyModalOpen(true);
  };

  const cerrarModalEmpresa = () => {
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
    setNuevaEmpresaNombre("");
    setNuevaEmpresaRut("");
    setNuevaEmpresaMegaNodeId(""); // LIMPIAR DATO
  };
  const handleEliminarEmpresa = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar esta empresa? Esto podría afectar a los usuarios vinculados.",
      )
    )
      return;
    try {
      await companyService.remove(id);
      await cargarEmpresas();
    } catch (error) {
      console.error("Error al eliminar empresa", error);
      mostrarAlerta("Hubo un error al eliminar la empresa.");
    }
  };

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={styles.mainContainer}>
        <section className={styles.bienvenida}>
          <div>
            <h1>Administración</h1>
            <h3>Gestiona usuarios y empresas del sistema</h3>
          </div>
          <div className={styles.botones}>
            <button className={styles.btnSecondary}>
              <Download size={16} />
              <span>Exportar</span>
            </button>
            {activeTab === "usuarios" ? (
              <button
                className={styles.btnPrimary}
                onClick={() => setIsUserModalOpen(true)}
              >
                <Plus size={16} />
                <span>Nuevo usuario</span>
              </button>
            ) : (
              <button
                className={styles.btnPrimary}
                onClick={() => setIsCompanyModalOpen(true)}
              >
                <Plus size={16} />
                <span>Nueva empresa</span>
              </button>
            )}
          </div>
        </section>

        <section className={styles.cardContainer}>
          {/* PESTAÑAS (TABS) - Solo visibles para SYSADMIN */}
          {currentUserRole === "SYSADMIN" && (
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabBtn} ${activeTab === "usuarios" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("usuarios")}
              >
                <UsersIcon
                  size={16}
                  style={{
                    display: "inline",
                    marginRight: "6px",
                    marginBottom: "-2px",
                  }}
                />
                Usuarios
              </button>
              <button
                className={`${styles.tabBtn} ${activeTab === "empresas" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("empresas")}
              >
                <Building2
                  size={16}
                  style={{
                    display: "inline",
                    marginRight: "6px",
                    marginBottom: "-2px",
                  }}
                />
                Empresas
              </button>
            </div>
          )}

          {/* ================= CONTENIDO: USUARIOS ================= */}
          {activeTab === "usuarios" && (
            <>
              <div className={styles.toolbarContainer}>
                <div className={styles.searchBox}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className={styles.toolbarActions}>
                  <div className={styles.selectWrapper}>
                    <Filter size={16} className={styles.filterIcon} />
                    <select
                      className={styles.selectRole}
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">Todos los roles</option>
                      <option value="SYSADMIN">Sysadmin</option>
                      <option value="ADMIN">Admin Empresa</option>
                      <option value="USER">Usuario</option>
                      <option value="GUEST">Invitado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.tablaContainer}>
                <table className={styles.tablaUsuarios}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Empresa</th>
                      <th>Correo electrónico</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Último acceso</th>
                      <th style={{ textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div
                              className={styles.avatar}
                              style={{ backgroundColor: usuario.avatarColor }}
                            >
                              {getIniciales(usuario.nombre)}
                            </div>
                            <div className={styles.userInfo}>
                              <span className={styles.userName}>
                                {usuario.nombre}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>{usuario.empresaNombre}</td>
                        <td className={styles.emailCell}>{usuario.email}</td>
                        <td>
                          <span
                            className={`${styles.badgeRol} ${styles[`rol${usuario.rol}`]}`}
                          >
                            <span className={styles.dotRol} />
                            {usuario.rol}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.badgeEstado} ${styles[`estado${usuario.estado}`]}`}
                          >
                            <span className={styles.dotEstado} />
                            {usuario.estado}
                          </span>
                        </td>
                        <td className={styles.accesoCell}>
                          {usuario.ultimoAcceso}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div
                            className={styles.actionCell}
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "12px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              className={styles.btnIconAction}
                              title="Editar"
                              onClick={() => handleOpenEditUser(usuario)}
                            >
                              <Pencil size={18} />
                            </button>
                            {usuario.estado === "Activo" && (
                              <button
                                className={styles.btnIconAction}
                                title="Desactivar"
                                onClick={() => handleDesactivarUser(usuario.id)}
                                style={{ color: "#f59e0b" }}
                              >
                                <Ban size={18} />
                              </button>
                            )}
                            <button
                              className={styles.btnIconAction}
                              title="Eliminar"
                              onClick={() => handleEliminarUser(usuario.id)}
                              style={{ color: "#ef4444" }}
                            >
                              <X size={22} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ================= CONTENIDO: EMPRESAS ================= */}
          {activeTab === "empresas" && currentUserRole === "SYSADMIN" && (
            <div className={styles.tablaContainer}>
              <table className={styles.tablaUsuarios}>
                <thead>
                  <tr>
                    <th>Razón Social</th>
                    <th>RUT</th>
                    <th>Carpeta MEGA (Node ID)</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td style={{ fontWeight: 600, color: "#0f172a" }}>
                        {empresa.razonSocial}
                      </td>
                      <td>{empresa.rut}</td>
                      <td>
                        {empresa.megaNodeId ? (
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: "#0284c7",
                            }}
                          >
                            {empresa.megaNodeId}
                          </span>
                        ) : (
                          <span
                            style={{ color: "#94a3b8", fontStyle: "italic" }}
                          >
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          className={styles.actionCell}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            className={styles.btnIconAction}
                            title="Editar"
                            onClick={() => handleOpenEditCompany(empresa)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className={styles.btnIconAction}
                            title="Eliminar"
                            onClick={() => handleEliminarEmpresa(empresa.id)}
                            style={{ color: "#ef4444" }}
                          >
                            <X size={22} strokeWidth={3} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL: NUEVO USUARIO ================= */}
      {isUserModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsUserModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setIsUserModalOpen(false)}
            >
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <h2>Nuevo Usuario</h2>
              <p className={styles.modalSubtitle}>
                Crea un nuevo usuario en el sistema
              </p>
            </div>
            <form onSubmit={handleCrearUsuario} className={styles.modalForm}>
              {currentUserRole === "SYSADMIN" && (
                <div className={styles.formGroup}>
                  <label>Empresa a la que pertenece</label>
                  <select
                    value={nuevoCompanyId}
                    onChange={(e) => setNuevoCompanyId(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una empresa...</option>
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.razonSocial}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>RUT Usuario</label>
                  <input
                    type="text"
                    value={nuevoRut}
                    onChange={(e) => setNuevoRut(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={nuevoPhone}
                    onChange={(e) => setNuevoPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Rol en el sistema</label>
                  <select
                    value={nuevoRole}
                    onChange={(e) => setNuevoRole(e.target.value)}
                  >
                    {currentUserRole === "SYSADMIN" && (
                      <option value="SYSADMIN">Sysadmin</option>
                    )}
                    <option value="ADMIN">Admin Empresa</option>
                    <option value="USER">Usuario Normal</option>
                    <option value="GUEST">Invitado</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDITAR USUARIO ================= */}
      {isEditUserModalOpen && editingUser && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setIsEditUserModalOpen(false);
            setEditingUser(null);
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => {
                setIsEditUserModalOpen(false);
                setEditingUser(null);
              }}
            >
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <h2>Editar Permisos</h2>
              <p className={styles.modalSubtitle}>
                Modifica el rol, estado y empresa del usuario
              </p>
            </div>
            <form
              onSubmit={handleGuardarEdicionUser}
              className={styles.modalForm}
            >
              <div className={styles.formGroup}>
                <label>Usuario seleccionado</label>
                <input type="text" value={editingUser.nombre} disabled />
              </div>

              {currentUserRole === "SYSADMIN" && (
                <div className={styles.formGroup}>
                  <label>Empresa Asociada</label>
                  <select
                    value={editingUser.empresaId}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        empresaId: e.target.value,
                      })
                    }
                  >
                    <option value="">Sin empresa (Global)</option>
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.razonSocial}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Rol</label>
                  <select
                    value={editingUser.rol}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        rol: e.target.value as any,
                      })
                    }
                  >
                    {currentUserRole === "SYSADMIN" && (
                      <option value="SYSADMIN">Sysadmin</option>
                    )}
                    <option value="ADMIN">Admin Empresa</option>
                    <option value="USER">Usuario Normal</option>
                    <option value="GUEST">Invitado</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select
                    value={editingUser.estado}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        estado: e.target.value as "Activo" | "Inactivo",
                      })
                    }
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => {
                    setIsEditUserModalOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Actualizar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NUEVA/EDITAR EMPRESA ================= */}
      {isCompanyModalOpen && (
        <div className={styles.modalOverlay} onClick={cerrarModalEmpresa}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={cerrarModalEmpresa}
            >
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <h2>{editingCompany ? "Editar Empresa" : "Nueva Empresa"}</h2>
              <p className={styles.modalSubtitle}>
                Gestiona los datos corporativos de esta entidad
              </p>
            </div>
            <form onSubmit={handleGuardarEmpresa} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Razón Social</label>
                <input
                  type="text"
                  value={nuevaEmpresaNombre}
                  onChange={(e) => setNuevaEmpresaNombre(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>RUT de la Empresa</label>
                <input
                  type="text"
                  value={nuevaEmpresaRut}
                  onChange={(e) => setNuevaEmpresaRut(e.target.value)}
                  required
                  maxLength={12}
                  placeholder="Ej: 76.123.456-7"
                />
              </div>
              {/* NUEVO INPUT PARA MEGA NODE ID */}
              <div className={styles.formGroup}>
                <label>Carpeta MEGA (Node ID)</label>
                <input
                  type="text"
                  value={nuevaEmpresaMegaNodeId}
                  onChange={(e) => setNuevaEmpresaMegaNodeId(e.target.value)}
                  placeholder="ID de la carpeta en MEGA (Opcional)"
                />
              </div>
              {/* FIN NUEVO INPUT */}
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={cerrarModalEmpresa}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alerta.visible && (
        <div className={styles.alertOverlay}>
          <div className={styles.alertBox}>
            <h3>⚠️ Datos incorrectos</h3>

            <p>{alerta.mensaje}</p>

            <button className={styles.btnPrimary} onClick={cerrarAlerta}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
