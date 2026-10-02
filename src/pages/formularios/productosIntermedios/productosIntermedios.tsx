// src/pages/formularios/productosIntermedios/productosIntermedios.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./productosIntermedios.module.css";

interface ProductosIntermediosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductosIntermediosModal({
  isOpen,
  onClose,
}: ProductosIntermediosModalProps) {
  const [listaIntermedios, setListaIntermedios] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    local: "Planta Huenchullami",
    encargado: "Lorena Reyes",
    responsable: "",
    productoElaborar: "",
    mmpp: "",
    cantidadMpp: "",
    loteMpp: "",
    fechaElab: "",
    fechaVenc: "",
    loteProd: "",
    cantidadFinalTotal: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loteProd.trim() || !formData.productoElaborar.trim()) {
      alert("Complete el producto a elaborar y el lote.");
      return;
    }

    setListaIntermedios([...listaIntermedios, formData]);

    // Limpiamos campos específicos del lote actual manteniendo generalidades
    setFormData({
      ...formData,
      productoElaborar: "",
      mmpp: "",
      cantidadMpp: "",
      loteMpp: "",
      loteProd: "",
      cantidadFinalTotal: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaIntermedios(
      listaIntermedios.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaIntermedios.length === 0) {
      alert("No hay registros en la lista para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/productos-intermedios/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productosIntermedios: listaIntermedios }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaIntermedios.length} registros de Productos Intermedios enviados a MEGA correctamente!`,
        );
        setListaIntermedios([]);
        onClose();
      } else {
        alert("Error al guardar los registros en el servidor.");
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
          <h2>
            Planilla Producción y Trazabilidad: Productos Intermedios
            (R-POE-2-2a)
          </h2>
          <p>
            Control de materias primas, pesos y trazabilidad de productos
            intermedios.
          </p>
        </div>

        <form onSubmit={handleAddRegistro} className={styles.modalForm}>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Local</label>
              <input
                type="text"
                name="local"
                value={formData.local}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Encargado</label>
              <input
                type="text"
                name="encargado"
                value={formData.encargado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Responsable de Lote</label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                placeholder="Nombre responsable"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Producto Intermedio a Elaborar</label>
              <input
                type="text"
                name="productoElaborar"
                value={formData.productoElaborar}
                placeholder="Ej: Mix Manjar / Crema Base"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.seccionSub}>
            Detalle de Materia Prima (MMPP)
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>MMPP / Insumo</label>
              <input
                type="text"
                name="mmpp"
                value={formData.mmpp}
                placeholder="Ej: Leche / Crema"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Cantidad MMPP</label>
              <input
                type="text"
                name="cantidadMpp"
                value={formData.cantidadMpp}
                placeholder="Ej: 30 kg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Lote MMPP</label>
            <input
              type="text"
              name="loteMpp"
              value={formData.loteMpp}
              placeholder="Lote de insumo"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.seccionSub}>
            Trazabilidad del Producto Intermedio
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Fecha Elaboración</label>
              <input
                type="date"
                name="fechaElab"
                value={formData.fechaElab}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha Vencimiento</label>
              <input
                type="date"
                name="fechaVenc"
                value={formData.fechaVenc}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Lote de Producto Intermedio</label>
              <input
                type="text"
                name="loteProd"
                value={formData.loteProd}
                placeholder="Ej: LOTE-INT-01"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Cantidad Final Total</label>
              <input
                type="text"
                name="cantidadFinalTotal"
                value={formData.cantidadFinalTotal}
                placeholder="Ej: 100 kg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Lote Intermedio a la Lista
            </button>
          </div>
        </form>

        {/* COLA DE REGISTROS */}
        {listaIntermedios.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Lotes intermedios en la lista ({listaIntermedios.length})</h3>
            <div className={styles.queueList}>
              {listaIntermedios.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    <strong>{item.productoElaborar}</strong> (Cant:{" "}
                    {item.cantidadFinalTotal})
                    <span className={styles.badgeLote}>
                      Lote: {item.loteProd}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleRemoveRegistro(index)}
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
            disabled={listaIntermedios.length === 0}
            style={{ opacity: listaIntermedios.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
