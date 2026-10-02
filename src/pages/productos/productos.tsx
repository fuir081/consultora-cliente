import { useState, useEffect, type ChangeEvent } from "react";
import {
  PackagePlus,
  Save,
  Tag,
  AlignLeft,
  DollarSign,
  Hash,
  Layers,
  Truck,
  Plus,
  Trash2,
  Edit,
  Search,
  X,
} from "lucide-react";
import styles from "./productos.module.css";
import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";

export default function Productos() {
  const [open, setOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el listado y filtros
  const [productos, setProductos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  // Catálogos REALES desde el backend
  const [listaProveedores, setListaProveedores] = useState<any[]>([]);
  const [catalogoProductos, setCatalogoProductos] = useState<any[]>([]);

  const initialState = {
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    codigo: "",
    tipo: "FINAL",
    unidad_medida: "unidades",
    proveedor_id: "",
  };
  const [productData, setProductData] = useState(initialState);
  const [ingredientes, setIngredientes] = useState<
    { id_producto: string; cantidad: string }[]
  >([]);

  useEffect(() => {
    const fetchCompany = "EMPRESA_12345";
    setCompanyId(fetchCompany);
    cargarDatos(fetchCompany);
  }, []);

  // Función para traer TODO desde la base de datos real
  const cargarDatos = async (empresa_id: string) => {
    try {
      // Traer Productos
      const resProd = await fetch(
        `http://localhost:3000/productos?empresa_id=${empresa_id}`,
      );
      if (resProd.ok) {
        const dataProd = await resProd.json();
        setProductos(dataProd);
        // El catálogo para las recetas solo debe mostrar Materias Primas e Intermedios
        setCatalogoProductos(dataProd.filter((p: any) => p.tipo !== "FINAL"));
      }

      // Traer Proveedores
      const resProv = await fetch(
        `http://localhost:3000/proveedores?empresa_id=${empresa_id}`,
      );
      if (resProv.ok) {
        const dataProv = await resProv.json();
        setListaProveedores(dataProv);
      }
    } catch (error) {
      console.error("Error al cargar los catálogos desde NestJS", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await fetch(`http://localhost:3000/productos/${id}`, {
          method: "DELETE",
        });
        setProductos(productos.filter((p) => p.id !== id));
        alert("Producto eliminado.");
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  const handleEdit = (producto: any) => {
    setProductData({
      ...producto,
      proveedor_id: producto.proveedor ? producto.proveedor.id : "",
    });

    // Formatear la receta si viene del backend
    if (producto.receta) {
      const recetaFormateada = producto.receta.map((r: any) => ({
        id_producto: r.producto_hijo.id,
        cantidad: r.cantidad,
      }));
      setIngredientes(recetaFormateada);
    } else {
      setIngredientes([]);
    }
    setView("form");
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const agregarIngrediente = () =>
    setIngredientes([...ingredientes, { id_producto: "", cantidad: "" }]);
  const actualizarIngrediente = (
    index: number,
    campo: string,
    valor: string,
  ) => {
    const nuevos = [...ingredientes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setIngredientes(nuevos);
  };
  const removerIngrediente = (index: number) =>
    setIngredientes(ingredientes.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...productData,
      empresa_id: companyId,
      receta: productData.tipo !== "MATERIA_PRIMA" ? ingredientes : [],
    };

    try {
      const url = productData.id
        ? `http://localhost:3000/productos/${productData.id}`
        : "http://localhost:3000/productos";
      const method = productData.id ? "PUT" : "POST";

      // FETCH DESCOMENTADO Y CON HEADERS CORRECTOS
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error en la respuesta de NestJS");

      alert(
        productData.id
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      );
      setProductData(initialState);
      setIngredientes([]);
      setView("list");

      // Recargar la tabla con el nuevo producto
      if (companyId) cargarDatos(companyId);
    } catch (error) {
      console.error(error);
      alert("Error al guardar. Revisa la consola de NestJS.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredProductos = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTipo === "" || p.tipo === filterTipo),
  );

  return (
    <div className={styles.layout}>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={`${styles.mainContent} ${open ? styles.shifted : ""}`}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Gestión de Productos e Inventario</h1>
            <p className={styles.subtitle}>
              Administra materias primas, productos intermedios y finales.
            </p>
          </div>
          {view === "list" && (
            <button
              className={styles.submitBtn}
              onClick={() => {
                setProductData(initialState);
                setView("form");
              }}
            >
              <Plus size={18} /> Nuevo Producto
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
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Todos los tipos</option>
                <option value="FINAL">Producto Final</option>
                <option value="INTERMEDIO">Intermedio</option>
                <option value="MATERIA_PRIMA">Materia Prima</option>
              </select>
            </div>

            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles["badge" + p.tipo]}`}
                      >
                        {p.tipo}
                      </span>
                    </td>
                    <td>{p.stock}</td>
                    <td>${p.precio}</td>
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
                {filteredProductos.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No se encontraron productos.
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
                {productData.id ? "Editar Producto" : "Nuevo Producto"}
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
                    <Layers size={16} className={styles.inputIcon} /> Nivel del
                    Producto
                  </label>
                  <select
                    name="tipo"
                    value={productData.tipo}
                    onChange={handleInputChange}
                    className={styles.input}
                  >
                    <option value="FINAL">Producto Final</option>
                    <option value="INTERMEDIO">Producto Intermedio</option>
                    <option value="MATERIA_PRIMA">Materia Prima</option>
                  </select>
                </div>
                {productData.tipo === "MATERIA_PRIMA" && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Truck size={16} className={styles.inputIcon} /> Proveedor
                    </label>
                    <select
                      name="proveedor_id"
                      value={productData.proveedor_id}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    >
                      <option value="">Seleccione un proveedor...</option>
                      {listaProveedores.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Tag size={16} className={styles.inputIcon} /> Nombre del
                    Producto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={productData.nombre}
                    onChange={handleInputChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Hash size={16} className={styles.inputIcon} /> Código/SKU
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={productData.codigo}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Hash size={16} className={styles.inputIcon} /> Stock Actual
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleInputChange}
                    className={styles.input}
                    min="0"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <AlignLeft size={16} className={styles.inputIcon} /> Unidad
                  </label>
                  <select
                    name="unidad_medida"
                    value={productData.unidad_medida}
                    onChange={handleInputChange}
                    className={styles.input}
                  >
                    <option value="unidades">Unidades</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="litros">Litros (L)</option>
                    <option value="gramos">Gramos (g)</option>
                  </select>
                </div>
              </div>

              {productData.tipo !== "MATERIA_PRIMA" && (
                <div
                  style={{
                    padding: "15px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    marginTop: "10px",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                    Fórmula / Ingredientes (BOM)
                  </h4>
                  {ingredientes.map((ing, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <select
                        value={ing.id_producto}
                        onChange={(e) =>
                          actualizarIngrediente(
                            index,
                            "id_producto",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        style={{ flexGrow: 1 }}
                        required
                      >
                        <option value="">Seleccione insumo...</option>
                        {catalogoProductos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} ({p.unidad})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={ing.cantidad}
                        onChange={(e) =>
                          actualizarIngrediente(
                            index,
                            "cantidad",
                            e.target.value,
                          )
                        }
                        className={styles.input}
                        style={{ width: "120px" }}
                        step="0.01"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removerIngrediente(index)}
                        style={{
                          padding: "10px",
                          backgroundColor: "#fee2e2",
                          color: "#ef4444",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={agregarIngrediente}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      color: "#4f46e5",
                      backgroundColor: "#e0e7ff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    <Plus size={14} /> Añadir Componente
                  </button>
                </div>
              )}
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
                  {isSubmitting ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
