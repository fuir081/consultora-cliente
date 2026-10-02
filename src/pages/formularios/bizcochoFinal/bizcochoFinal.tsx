// src/pages/formularios/bizcochosFinal/bizcochosFinal.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./bizcochosFinal.module.css";

interface BizcochosFinalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BizcochosFinalModal({
  isOpen,
  onClose,
}: BizcochosFinalModalProps) {
  const [listaProduccion, setListaProduccion] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    local: "Planta Huenchullami",
    encargado: "Lorena Reyes",
    responsableLote: "",
    productoElaborar: "Bizcochos Rellenos",
    mmppUsada: "",
    cantidadMpp: "",
    loteMpp: "",
    fechaVencMpp: "",
    fechaElab: "",
    fechaVencProd: "",
    loteProd: "",
    cantidadTotalLote: "",
    tempCoccion: "", // Límite crítico: 68°C centro
    conteoTotalLote: "",
    manjarGr: "",
    chocolateExtraGr: "",
    mermaGr: "",
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
    if (!formData.loteProd.trim() || !formData.tempCoccion.trim()) {
      alert("Complete el lote del producto y la temperatura de cocción.");
      return;
    }

    setListaProduccion([...listaProduccion, formData]);

    // Limpiamos campos específicos del lote actual manteniendo generalidades para agilizar
    setFormData({
      ...formData,
      loteProd: "",
      cantidadTotalLote: "",
      tempCoccion: "",
      conteoTotalLote: "",
      manjarGr: "",
      chocolateExtraGr: "",
      mermaGr: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaProduccion(
      listaProduccion.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaProduccion.length === 0) {
      alert("No hay registros en la lista para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/bizcochos-final/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ producciones: listaProduccion }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaProduccion.length} registros de Bizcochos Rellenos enviados a MEGA correctamente!`,
        );
        setListaProduccion([]);
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
            Planilla Producción y Trazabilidad: Bizcochos Rellenos (R-POE-2-1a)
          </h2>
          <p>
            Límite Crítico: Temperatura de cocción 68°C en el centro del
            producto.
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
                name="responsableLote"
                value={formData.responsableLote}
                placeholder="Nombre responsable"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Producto a Elaborar</label>
              <input
                type="text"
                name="productoElaborar"
                value={formData.productoElaborar}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.seccionSub}>
            Detalle de Materia Prima (MMPP) e Insumos
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>MMPP / Insumo Utilizado</label>
              <input
                type="text"
                name="mmppUsada"
                value={formData.mmppUsada}
                placeholder="Ej: Harina / Margarina"
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
                placeholder="Ej: 50 kg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
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
            <div className={styles.formGroup}>
              <label>Fecha Vencimiento MMPP</label>
              <input
                type="date"
                name="fechaVencMpp"
                value={formData.fechaVencMpp}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.seccionSub}>
            Trazabilidad y Fechas de Producto
          </div>

          <div className={styles.grid3}>
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
                name="fechaVencProd"
                value={formData.fechaVencProd}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Lote de Producto</label>
              <input
                type="text"
                name="loteProd"
                value={formData.loteProd}
                placeholder="Ej: LOTE-BIZ-01"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Cantidad Total Lote</label>
              <input
                type="text"
                name="cantidadTotalLote"
                value={formData.cantidadTotalLote}
                placeholder="Ej: 200 unidades"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Temp. Cocción Centro (°C)</label>
              <input
                type="number"
                step="0.1"
                name="tempCoccion"
                value={formData.tempCoccion}
                placeholder="Mínimo 68°C"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.seccionSub}>Proceso, Rellenos y Merma</div>

          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Conteo Total Lote</label>
              <input
                type="text"
                name="conteoTotalLote"
                value={formData.conteoTotalLote}
                placeholder="Conteo final"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Manjar (Gr)</label>
              <input
                type="number"
                name="manjarGr"
                value={formData.manjarGr}
                placeholder="Gramos usados"
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Chocolate Extra (Gr)</label>
              <input
                type="number"
                name="chocolateExtraGr"
                value={formData.chocolateExtraGr}
                placeholder="Gramos usados"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Merma (Gr)</label>
            <input
              type="number"
              name="mermaGr"
              value={formData.mermaGr}
              placeholder="Gramos de merma"
              onChange={handleChange}
            />
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Lote a la Lista
            </button>
          </div>
        </form>

        {/* COLA DE REGISTROS */}
        {listaProduccion.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Lotes en la lista ({listaProduccion.length})</h3>
            <div className={styles.queueList}>
              {listaProduccion.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    <strong>{item.productoElaborar}</strong> (Cocción:{" "}
                    {item.tempCoccion}°C)
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
            disabled={listaProduccion.length === 0}
            style={{ opacity: listaProduccion.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
