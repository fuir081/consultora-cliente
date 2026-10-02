// src/pages/formularios/temperatura/temperatura.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./temperatura.module.css";

interface TemperaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemperaturaModal({
  isOpen,
  onClose,
}: TemperaturaModalProps) {
  // Cola de registros de temperatura
  const [listaTemperaturas, setListaTemperaturas] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    mes: "",
    dia: "",
    jornada: "Mañana",
    camaraEquipo: "Cámara de Congelados (-18°C)",
    temperatura: "",
    observacion: "",
    firma: "",
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
    if (!formData.temperatura.trim()) {
      alert("Ingrese la temperatura registrada.");
      return;
    }

    setListaTemperaturas([...listaTemperaturas, formData]);

    // Limpiamos los campos específicos del registro manteniendo mes/día/firma para agilizar
    setFormData({
      ...formData,
      temperatura: "",
      observacion: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaTemperaturas(
      listaTemperaturas.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaTemperaturas.length === 0) {
      alert("No hay registros de temperatura en la cola.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/temperatura/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ registros: listaTemperaturas }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaTemperaturas.length} registros de temperatura enviados a MEGA correctamente!`,
        );
        setListaTemperaturas([]);
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
          <h2>Control de Temperatura Almacenamiento (R-POE-1-2)</h2>
          <p>
            Monitoreo de cámaras de frío (Límite: Refrig. -1°C a 5°C | Congelado
            desde -18°C).
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
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Jornada</label>
              <select
                name="jornada"
                value={formData.jornada}
                onChange={handleChange}
              >
                <option value="Mañana">Mañana (Inicio jornada)</option>
                <option value="Tarde">Tarde (Fin jornada)</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Cámara / Equipo</label>
              <select
                name="camaraEquipo"
                value={formData.camaraEquipo}
                onChange={handleChange}
              >
                <option value="Cámara de Congelados (-18°C)">
                  Cámara de Congelados (-18°C)
                </option>
                <option value="Cámara de Refrigerados (4°C)">
                  Cámara de Refrigerados (4°C)
                </option>
                <option value="Sala de Proceso / Frío">
                  Sala de Proceso / Frío
                </option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Temperatura Registrada (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperatura"
                value={formData.temperatura}
                placeholder="Ej: -18.5 o 3.2"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Observación / Acción Correctiva (Si no cumple límite)</label>
            <textarea
              name="observacion"
              rows={2}
              value={formData.observacion}
              placeholder="Detallar si se reubicó producto o solicitó mantención..."
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Responsable / Firma</label>
            <input
              type="text"
              name="firma"
              value={formData.firma}
              placeholder="Nombre completo"
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.addBtnContainer}>
            <button type="submit" className={styles.btnAdd}>
              <Plus size={16} /> Agregar Control a la Lista
            </button>
          </div>
        </form>

        {/* COLA DE REGISTROS DE TEMPERATURA */}
        {listaTemperaturas.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Controles en la lista ({listaTemperaturas.length})</h3>
            <div className={styles.queueList}>
              {listaTemperaturas.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    Día {item.dia} - <strong>{item.camaraEquipo}</strong>:{" "}
                    {item.temperatura}°C
                    <span className={styles.badgeJornada}>{item.jornada}</span>
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
            disabled={listaTemperaturas.length === 0}
            style={{ opacity: listaTemperaturas.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
