// src/pages/formularios/mixHarinas/mixHarinas.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./mixHarinas.module.css";

interface MixHarinasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MixHarinasModal({
  isOpen,
  onClose,
}: MixHarinasModalProps) {
  const [listaMix, setListaMix] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fecha: "",
    responsable: "",
    productoInsumo: "Harina de almendra",
    cantidadKg: "",
    marca: "",
    lote: "",
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
    if (!formData.lote.trim() || !formData.cantidadKg.trim()) {
      alert("Complete la cantidad y el lote del insumo.");
      return;
    }

    setListaMix([...listaMix, formData]);

    // Limpiamos campos específicos del insumo manteniendo fecha y responsable
    setFormData({
      ...formData,
      cantidadKg: "",
      marca: "",
      lote: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaMix(listaMix.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitFinal = async () => {
    if (listaMix.length === 0) {
      alert("No hay registros de adición en la lista para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/mix-harinas/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mezclas: listaMix }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaMix.length} registros de MIX Harinas y Aditivos enviados a MEGA correctamente!`,
        );
        setListaMix([]);
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
          <h2>Planilla de Producción: MIX Harinas y Aditivos (R-POE-2-3)</h2>
          <p>
            Control de adición de aditivos según recetas y loteo de mezclas.
          </p>
        </div>

        <form onSubmit={handleAddRegistro} className={styles.modalForm}>
          <div className={styles.grid2}>
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
            <div className={styles.formGroup}>
              <label>Responsable</label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                placeholder="Nombre completo"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.seccionSub}>Información por Insumo / Lote</div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Producto / Insumo</label>
              <select
                name="productoInsumo"
                value={formData.productoInsumo}
                onChange={handleChange}
              >
                <option value="Harina de almendra">Harina de almendra</option>
                <option value="Harina de coco">Harina de coco</option>
                <option value="Harina de arroz">Harina de arroz</option>
                <option value="Alulosa">Alulosa</option>
                <option value="Polvos de hornear">Polvos de hornear</option>
                <option value="Leche en polvo">Leche en polvo</option>
                <option value="Cacao">Cacao</option>
                <option value="Bicarbonato">Bicarbonato</option>
                <option value="Maicena">Maicena</option>
                <option value="Otro aditivo / ingrediente">
                  Otro aditivo / ingrediente
                </option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Cantidad (Kg)</label>
              <input
                type="number"
                step="0.01"
                name="cantidadKg"
                value={formData.cantidadKg}
                placeholder="Ej: 5.5"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                placeholder="Marca del producto"
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
                placeholder="N° de lote"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Insumo a la Lista
            </button>
          </div>
        </form>

        {/* COLA DE REGISTROS */}
        {listaMix.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Insumos en la lista ({listaMix.length})</h3>
            <div className={styles.queueList}>
              {listaMix.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    <strong>{item.productoInsumo}</strong> - {item.cantidadKg}{" "}
                    Kg
                    <span className={styles.badgeLote}>Lote: {item.lote}</span>
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
            disabled={listaMix.length === 0}
            style={{ opacity: listaMix.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
