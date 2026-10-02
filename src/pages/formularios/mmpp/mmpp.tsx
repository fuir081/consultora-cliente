// src/pages/formularios/mmpp/mmpp.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./mmpp.module.css";

interface MmppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Base de datos simulada de proveedores y sus productos asociados
const PROVEEDORES_DB = [
  {
    nombre: "ICP (Inversiones Agrícolas)",
    productos: [
      "Lechugas Hidropónicas",
      "Tomates Pera",
      "Cebollas Granel",
      "Zanahorias",
    ],
  },
  {
    nombre: "Distribuidora Los Fiambres SpA",
    productos: [
      "Queso Gauda Laminado",
      "Jamón Cocido Extra",
      "Salame Italiano",
      "Queso Mantecoso",
    ],
  },
  {
    nombre: "Comercializadora FríoSur",
    productos: [
      "Filete de Salmón Congelado",
      "Pechuga de Pollo Sin Hueso",
      "Pulpa de Cerdo",
    ],
  },
  {
    nombre: "Panificadora y Molinos del Sur",
    productos: [
      "Harina Tradicional T-55",
      "Levadura Seca Industrial",
      "Manteca Vegetal Refinada",
    ],
  },
];

export default function MmppModal({ isOpen, onClose }: MmppModalProps) {
  const [listaProductos, setListaProductos] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fecha: "",
    producto: "",
    kg: "",
    proveedor: "",
    nFactura: "",
    lote: "",
    fechaVencimiento: "",
    marca: "",
    condicionesF: "cumple",
    condicionesQ: "cumple",
    condicionesB: "cumple",
    temperatura: "",
    encargado: "",
  });

  // Productos disponibles según el proveedor seleccionado
  const [productosDisponibles, setProductosDisponibles] = useState<string[]>(
    [],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Si cambia el proveedor, filtramos automáticamente sus productos
    if (name === "proveedor") {
      const provSeleccionado = PROVEEDORES_DB.find((p) => p.nombre === value);
      setProductosDisponibles(
        provSeleccionado ? provSeleccionado.productos : [],
      );
      // Reseteamos el producto actual al cambiar de proveedor
      setFormData({ ...formData, proveedor: value, producto: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setListaProductos([...listaProductos, formData]);

    // Limpiamos los campos específicos del producto, manteniendo proveedor, fecha y factura
    setFormData({
      ...formData,
      producto: "",
      kg: "",
      lote: "",
      fechaVencimiento: "",
      marca: "",
      temperatura: "",
      condicionesF: "cumple",
      condicionesQ: "cumple",
      condicionesB: "cumple",
    });
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setListaProductos(
      listaProductos.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaProductos.length === 0) {
      alert("No hay productos en la lista para guardar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/mmpp/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recepciones: listaProductos }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaProductos.length} registros MMPP enviados a MEGA correctamente!`,
        );
        setListaProductos([]);
        onClose();
      } else {
        alert("Error al guardar el lote de formularios MMPP.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor NestJS.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <h2>Recepción MMPP e Insumos (R-POE-1-1)</h2>
          <p>
            Seleccione el proveedor registrado y agregue los productos a la
            cola.
          </p>
        </div>

        <form onSubmit={handleAddProduct} className={styles.modalForm}>
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Selector de Proveedores desde la BD de ejemplo */}
            <div className={styles.formGroup}>
              <label>Proveedor</label>
              <select
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione proveedor...</option>
                {PROVEEDORES_DB.map((prov, idx) => (
                  <option key={idx} value={prov.nombre}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>N° Factura / Guía</label>
              <input
                type="text"
                name="nFactura"
                value={formData.nFactura}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.grid3}>
            {/* Selector dinámico de productos según el proveedor elegido */}
            <div className={styles.formGroup}>
              <label>Producto</label>
              <select
                name="producto"
                value={formData.producto}
                onChange={handleChange}
                required
                disabled={!formData.proveedor}
              >
                <option value="">
                  {formData.proveedor
                    ? "Seleccione producto..."
                    : "Elija un proveedor primero"}
                </option>
                {productosDisponibles.map((prod, idx) => (
                  <option key={idx} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Kg</label>
              <input
                type="number"
                step="0.01"
                name="kg"
                value={formData.kg}
                placeholder="0.00"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Lote</label>
              <input
                type="text"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Fecha Vencimiento</label>
              <input
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Marca Producto</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperatura"
                value={formData.temperatura}
                placeholder="Ej: -12"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <table className={styles.checkTable}>
            <thead>
              <tr>
                <th>Condiciones Organolépticas</th>
                <th className="center">Cumple</th>
                <th className="center">No Cumple</th>
              </tr>
            </thead>
            <tbody>
              {["F", "Q", "B"].map((tipo) => (
                <tr key={tipo}>
                  <td>
                    {tipo === "F"
                      ? "Físicas (F)"
                      : tipo === "Q"
                        ? "Químicas (Q)"
                        : "Biológicas (B)"}
                  </td>
                  <td className="center">
                    <input
                      type="radio"
                      name={`condiciones${tipo}`}
                      value="cumple"
                      checked={
                        formData[`condiciones${tipo as "F" | "Q" | "B"}`] ===
                        "cumple"
                      }
                      onChange={handleChange}
                    />
                  </td>
                  <td className="center">
                    <input
                      type="radio"
                      name={`condiciones${tipo}`}
                      value="no_cumple"
                      checked={
                        formData[`condiciones${tipo as "F" | "Q" | "B"}`] ===
                        "no_cumple"
                      }
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.formGroup}>
            <label>Nombre y Firma (Responsable)</label>
            <input
              type="text"
              name="encargado"
              value={formData.encargado}
              placeholder="Nombre completo"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Producto a la Lista
            </button>
          </div>
        </form>

        {listaProductos.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Productos listos para enviar ({listaProductos.length})</h3>
            <div className={styles.queueList}>
              {listaProductos.map((prod, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    <strong>{prod.producto}</strong> - {prod.kg}kg (Lote:{" "}
                    {prod.lote})
                    <span className={styles.queueTemp}>
                      {prod.temperatura}°C
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSubmitFinal}
            disabled={listaProductos.length === 0}
            style={{ opacity: listaProductos.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
