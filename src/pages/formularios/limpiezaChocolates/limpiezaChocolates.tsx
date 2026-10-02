// src/pages/formularios/limpiezaChocolates/limpiezaChocolates.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./limpiezaChocolates.module.css";

interface LimpiezaChocolatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimpiezaChocolatesModal({
  isOpen,
  onClose,
}: LimpiezaChocolatesModalProps) {
  const [listaLimpieza, setListaLimpieza] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    mes: "",
    fechaDia: "",
    responsable: "",
    elementos: {
      pisos: "cumple",
      muros: "cumple",
      cielos: "cumple",
      mesones1: "cumple",
      mesones2: "cumple",
      mesones3: "cumple",
      mesones4: "cumple",
      mesones5: "cumple",
      chocolatera1: "cumple",
      chocolatera2: "cumple",
      mantenedor1: "cumple",
      mantenedor2: "cumple",
      congeladores1: "cumple",
      congeladores2: "cumple",
      estanterias: "cumple",
      utensilios: "cumple",
      batidora: "cumple",
      revolvedora: "cumple",
      plagas: "cumple",
      elementosFisicos: "cumple",
      quimicos: "cumple",
    },
    observaciones: "",
    firma: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleElementoChange = (elemento: string, valor: string) => {
    setFormData({
      ...formData,
      elementos: { ...formData.elementos, [elemento]: valor },
    });
  };

  const handleAddRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fechaDia.trim() || !formData.mes.trim()) {
      alert("Complete el mes y el día de monitoreo.");
      return;
    }

    setListaLimpieza([...listaLimpieza, formData]);

    // Limpiamos el día y observaciones manteniendo mes y responsable para agilizar
    setFormData({
      ...formData,
      fechaDia: "",
      observaciones: "",
      firma: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaLimpieza(
      listaLimpieza.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaLimpieza.length === 0) {
      alert("No hay registros en la lista para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/limpieza-chocolates/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ registros: listaLimpieza }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaLimpieza.length} registros de Limpieza de Sala de Chocolate enviados a MEGA correctamente!`,
        );
        setListaLimpieza([]);
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
            Limpieza y Sanitización: Armado y Bañado de Chocolate (R-POES-5-1)
          </h2>
          <p>
            Revisión visual diaria de mesones, chocolateras, mantenedores y
            equipos.
          </p>
        </div>

        <form onSubmit={handleAddRegistro} className={styles.modalForm}>
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Mes de Monitoreo</label>
              <input
                type="text"
                name="mes"
                value={formData.mes}
                placeholder="Ej: Septiembre 2026"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Día (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                name="fechaDia"
                value={formData.fechaDia}
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

          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              border: "1px solid #f1f5f9",
              marginTop: "10px",
            }}
          >
            <table className={styles.checkTable}>
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "white",
                  zIndex: 10,
                }}
              >
                <tr>
                  <th>Área / Equipo / Control</th>
                  <th className="center">Cumple (√)</th>
                  <th className="center">No Cumple (X)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: "pisos", label: "Pisos" },
                  { key: "muros", label: "Muros" },
                  { key: "cielos", label: "Cielos" },
                  { key: "mesones1", label: "Mesones 1" },
                  { key: "mesones2", label: "Mesones 2" },
                  { key: "mesones3", label: "Mesones 3" },
                  { key: "mesones4", label: "Mesones 4" },
                  { key: "mesones5", label: "Mesones 5" },
                  { key: "chocolatera1", label: "Chocolatera 1" },
                  { key: "chocolatera2", label: "Chocolatera 2" },
                  { key: "mantenedor1", label: "Mantenedor 1" },
                  { key: "mantenedor2", label: "Mantenedor 2" },
                  { key: "congeladores1", label: "Congeladores 1" },
                  { key: "congeladores2", label: "Congeladores 2" },
                  { key: "estanterias", label: "Estanterías" },
                  { key: "utensilios", label: "Utensilios" },
                  { key: "batidora", label: "Batidora" },
                  { key: "revolvedora", label: "Revolvedora" },
                  { key: "plagas", label: "S/P de plagas" },
                  {
                    key: "elementosFisicos",
                    label: "S/P Elementos físicos extraños",
                  },
                  { key: "quimicos", label: "S/P Químicos fuera de lugar" },
                ].map((item) => (
                  <tr key={item.key}>
                    <td>{item.label}</td>
                    <td className="center">
                      <input
                        type="radio"
                        name={`elem_${item.key}`}
                        checked={
                          formData.elementos[
                            item.key as keyof typeof formData.elementos
                          ] === "cumple"
                        }
                        onChange={() =>
                          handleElementoChange(item.key, "cumple")
                        }
                      />
                    </td>
                    <td className="center">
                      <input
                        type="radio"
                        name={`elem_${item.key}`}
                        checked={
                          formData.elementos[
                            item.key as keyof typeof formData.elementos
                          ] === "no_cumple"
                        }
                        onChange={() =>
                          handleElementoChange(item.key, "no_cumple")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={styles.grid2}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            <div className={styles.formGroup}>
              <label>Observaciones / Acción Correctiva</label>
              <textarea
                name="observaciones"
                rows={2}
                value={formData.observaciones}
                placeholder="Detallar si se volvió a lavar y sanitizar..."
                onChange={handleChange}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Firma / Responsable</label>
              <input
                type="text"
                name="firma"
                value={formData.firma}
                placeholder="Firma o nombre"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Registro a la Lista
            </button>
          </div>
        </form>

        {/* COLA DE REGISTROS */}
        {listaLimpieza.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Registros en la lista ({listaLimpieza.length})</h3>
            <div className={styles.queueList}>
              {listaLimpieza.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    Sala Armado y Bañado Chocolate ({item.mes})
                    <span className={styles.badgeDia}>Día {item.fechaDia}</span>
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
            disabled={listaLimpieza.length === 0}
            style={{ opacity: listaLimpieza.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
