import { useState, useEffect, type ChangeEvent } from "react";
import {
  Truck,
  Save,
  Building2,
  Mail,
  Phone,
  Hash,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";
import styles from "./proveedores.module.css";
import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";

export default function Proveedores() {
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proveedores, setProveedores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const initialState = {
    id: "",
    nombre_empresa: "",
    rut: "",
    telefono: "",
    email: "",
    direccion: "",
  };
  const [proveedorData, setProveedorData] = useState(initialState);

  useEffect(() => {
    const fetchCompany = "EMPRESA_12345";
    setCompanyId(fetchCompany);
    fetchProveedores(fetchCompany);
  }, []);

  const fetchProveedores = async (empresa_id: string) => {
    try {
      // await fetch(`http://localhost:3000/proveedores?empresa_id=${empresa_id}`)
      setProveedores([
        {
          id: "1",
          nombre_empresa: "Molino San Cristóbal",
          rut: "76.543.210-K",
          telefono: "+56912345678",
          email: "ventas@molino.cl",
          direccion: "Av. Central 123",
        },
      ]);
    } catch (error) {
      console.error("Error fetching proveedores");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este proveedor?")) {
      try {
        setProveedores(proveedores.filter((p) => p.id !== id));
        alert("Proveedor eliminado.");
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  const handleEdit = (proveedor: any) => {
    setProveedorData(proveedor);
    setView("form");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = { ...proveedorData, empresa_id: companyId };

    try {
      const url = proveedorData.id
        ? `http://localhost:3000/proveedores/${proveedorData.id}`
        : "http://localhost:3000/proveedores";
      const method = proveedorData.id ? "PUT" : "POST";

      // await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      alert(
        proveedorData.id
          ? "Proveedor actualizado."
          : "Proveedor agregado exitosamente.",
      );
      setProveedorData(initialState);
      setView("list");
      if (companyId) fetchProveedores(companyId);
    } catch (error) {
      alert("Hubo un error al guardar el proveedor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProveedores = proveedores.filter(
    (p) =>
      p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rut.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.layout}>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={`${styles.mainContent} ${open ? styles.shifted : ""}`}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Directorio de Proveedores</h1>
            <p className={styles.subtitle}>
              Registra y administra las empresas que suministran materias
              primas.
            </p>
          </div>
          {view === "list" && (
            <button
              className={styles.submitBtn}
              onClick={() => {
                setProveedorData(initialState);
                setView("form");
              }}
            >
              <Plus size={18} /> Nuevo Proveedor
            </button>
          )}
        </div>

        {view === "list" ? (
          <div className={styles.tableContainer}>
            <div className={styles.filterBar}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar por empresa o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>RUT</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProveedores.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.nombre_empresa}</strong>
                    </td>
                    <td>{p.rut}</td>
                    <td>{p.telefono}</td>
                    <td>{p.email}</td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleEdit(p)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProveedores.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No se encontraron proveedores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0 }}>
                {proveedorData.id ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setView("list")}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Building2 size={16} className={styles.inputIcon} /> Razón
                    Social / Empresa
                  </label>
                  <input
                    type="text"
                    name="nombre_empresa"
                    value={proveedorData.nombre_empresa}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Hash size={16} className={styles.inputIcon} /> RUT
                  </label>
                  <input
                    type="text"
                    name="rut"
                    value={proveedorData.rut}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="12.345.678-9"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={16} className={styles.inputIcon} /> Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={proveedorData.telefono}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={16} className={styles.inputIcon} /> Correo
                    Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={proveedorData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MapPin size={16} className={styles.inputIcon} /> Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={proveedorData.direccion}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting || !companyId}
                >
                  <Save size={18} />{" "}
                  {isSubmitting ? "Guardando..." : "Guardar Proveedor"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
