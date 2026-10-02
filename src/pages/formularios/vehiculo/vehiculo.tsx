// src/pages/formularios/vehiculo/vehiculo.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2 } from "lucide-react";
import styles from "./vehiculo.module.css";

interface VehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehiculoModal({ isOpen, onClose }: VehiculoModalProps) {
  const [listaRegistros, setListaRegistros] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patente: "",
    mes: "",
    dia: "",
    jornada: "Mañana",
    temperatura: "",
    observacion: "",
    controladoPor: "",
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
      alert("Ingrese la temperatura del vehículo.");
      return;
    }

    setListaRegistros([...listaRegistros, formData]);

    // Limpiamos los campos específicos del registro manteniendo patente, mes y responsable para agilizar
    setFormData({
      ...formData,
      temperatura: "",
      observacion: "",
    });
  };

  const handleRemoveRegistro = (indexToRemove: number) => {
    setListaRegistros(
      listaRegistros.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaRegistros.length === 0) {
      alert("No hay registros en la cola para enviar.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/formularios/vehiculo/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ registros: listaRegistros }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaRegistros.length} registros de temperatura de vehículo enviados a MEGA correctamente!`,
        );
        setListaRegistros([]);
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
          <h2>Control de Temperatura Vehículo de Transporte (R-POE-01-05)</h2>
          <p>Límite crítico: -6.0°C a 4ºC. Monitoreo en despachos.</p>
        </div>

        <form onSubmit={handleAddRegistro} className={styles.modalForm}>
          <div className={styles.grid3}>
            <div className={styles.formGroup}>
              <label>Patente del Camión</label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                placeholder="Ej: ABCD-12"
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mes</label>
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
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Jornada</label>
              <select
                name="jornada"
                value={formData.jornada}
                onChange={handleChange}
              >
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Temperatura Registrada (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperatura"
                value={formData.temperatura}
                placeholder="Ej: -4.5"
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
              placeholder="Detallar novedades o aviso a jefatura..."
              onChange={handleChange}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Controlado por (Responsable)</label>
            <input
              type="text"
              name="controladoPor"
              value={formData.controladoPor}
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

        {/* COLA DE REGISTROS */}
        {listaRegistros.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Registros en la lista ({listaRegistros.length})</h3>
            <div className={styles.queueList}>
              {listaRegistros.map((item, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    Camión {item.patente} (Día {item.dia}):{" "}
                    <strong>{item.temperatura}°C</strong>
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
            disabled={listaRegistros.length === 0}
            style={{ opacity: listaRegistros.length === 0 ? 0.5 : 1 }}
          >
            <Save size={16} /> Enviar Lista a MEGA
          </button>
        </div>
      </div>
    </div>
  );
}
