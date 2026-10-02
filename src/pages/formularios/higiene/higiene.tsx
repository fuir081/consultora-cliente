// src/pages/formularios/higiene/higiene.tsx
import React, { useState } from "react";
import { X, Save, Plus, Trash2, Loader2 } from "lucide-react";
import styles from "./higiene.module.css";

interface HigieneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // <-- NUEVO: Función para avisar al dashboard
}

export default function HigieneModal({
  isOpen,
  onClose,
  onSuccess,
}: HigieneModalProps) {
  const [listaEvaluaciones, setListaEvaluaciones] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    semana: "",
    diaEvaluacion: "Lunes",
    responsable: "",
    colaborador: "",
    evaluaciones: {
      uniforme: "cumple",
      pelo: "cumple",
      manos: "cumple",
      joyas: "cumple",
      maquillaje: "cumple",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEvalChange = (criterio: string, valor: string) => {
    setFormData({
      ...formData,
      evaluaciones: { ...formData.evaluaciones, [criterio]: valor },
    });
  };

  const handleAddEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.colaborador.trim()) {
      alert("Por favor ingrese el nombre del colaborador.");
      return;
    }

    setListaEvaluaciones([...listaEvaluaciones, formData]);

    setFormData({
      ...formData,
      colaborador: "",
      evaluaciones: {
        uniforme: "cumple",
        pelo: "cumple",
        manos: "cumple",
        joyas: "cumple",
        maquillaje: "cumple",
      },
    });
  };

  const handleRemoveEvaluation = (indexToRemove: number) => {
    setListaEvaluaciones(
      listaEvaluaciones.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmitFinal = async () => {
    if (listaEvaluaciones.length === 0) {
      alert("No hay evaluaciones en la lista para guardar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/formularios/higiene/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ evaluaciones: listaEvaluaciones }),
        },
      );

      if (response.ok) {
        alert(
          `¡${listaEvaluaciones.length} registros de Higiene guardados en MEGA!`,
        );

        // --- NUEVA LÓGICA DE ALMACENAMIENTO (Storage) ---
        // Guardamos la fecha de hoy para este formulario
        const hoy = new Date().toLocaleDateString(); // ej: "30/09/2026"
        localStorage.setItem("form_higiene_last_date", hoy);

        setListaEvaluaciones([]);

        // Avisamos al componente padre que fue exitoso y cerramos
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert("Error al actualizar el Excel en MEGA.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor NestJS.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={!isSubmitting ? onClose : undefined}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.modalClose}
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <h2>Registro Higiene Personal (R-POES-1-1)</h2>
          <p>
            Evalúe a los colaboradores y agréguelos a la lista antes de enviar.
          </p>
        </div>

        <form onSubmit={handleAddEvaluation} className={styles.modalForm}>
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Semana</label>
              <input
                type="text"
                name="semana"
                value={formData.semana}
                placeholder="Ej: Semana 1"
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Día de Evaluación</label>
              <select
                name="diaEvaluacion"
                value={formData.diaEvaluacion}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="Lunes">Lunes (Lu)</option>
                <option value="Martes">Martes (Ma)</option>
                <option value="Miércoles">Miércoles (Mi)</option>
                <option value="Jueves">Jueves (Ju)</option>
                <option value="Viernes">Viernes (Vi)</option>
                <option value="Sábado">Sábado (Sa)</option>
                <option value="Domingo">Domingo (Do)</option>
              </select>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label>Responsable de la revisión</label>
              <input
                type="text"
                name="responsable"
                value={formData.responsable}
                placeholder="Tu nombre"
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nombre del Colaborador</label>
              <input
                type="text"
                name="colaborador"
                value={formData.colaborador}
                placeholder="Nombre completo"
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <table className={styles.checkTable}>
            <thead>
              <tr>
                <th>Criterio de Evaluación (Hábitos y prácticas)</th>
                <th className="center">Cumple (√)</th>
                <th className="center">No Cumple (X)</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  key: "uniforme",
                  label: "Uniforme completo, zapatos limpios y salud",
                },
                { key: "pelo", label: "Pelo tomado y cubierto" },
                {
                  key: "manos",
                  label: "Manos lavadas, uñas cortas / sin esmalte",
                },
                { key: "joyas", label: "Sin joyas y accesorios" },
                {
                  key: "maquillaje",
                  label: "Sin maquillaje / Afeitado o cubre barba",
                },
              ].map((item) => (
                <tr key={item.key}>
                  <td>{item.label}</td>
                  <td className="center">
                    <input
                      type="radio"
                      name={`eval_${item.key}`}
                      checked={
                        formData.evaluaciones[
                          item.key as keyof typeof formData.evaluaciones
                        ] === "cumple"
                      }
                      onChange={() => handleEvalChange(item.key, "cumple")}
                      disabled={isSubmitting}
                    />
                  </td>
                  <td className="center">
                    <input
                      type="radio"
                      name={`eval_${item.key}`}
                      checked={
                        formData.evaluaciones[
                          item.key as keyof typeof formData.evaluaciones
                        ] === "no_cumple"
                      }
                      onChange={() => handleEvalChange(item.key, "no_cumple")}
                      disabled={isSubmitting}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.addBtnContainer}>
            <button
              type="submit"
              className={styles.btnAdd}
              disabled={isSubmitting}
            >
              <Plus size={16} /> Agregar Colaborador a la Lista
            </button>
          </div>
        </form>

        {listaEvaluaciones.length > 0 && (
          <div className={styles.queueContainer}>
            <h3>Colaboradores en la lista ({listaEvaluaciones.length})</h3>
            <div className={styles.queueList}>
              {listaEvaluaciones.map((evalItem, index) => (
                <div key={index} className={styles.queueItem}>
                  <div className={styles.queueInfo}>
                    <strong>{evalItem.colaborador}</strong> (
                    {evalItem.diaEvaluacion})
                  </div>
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => handleRemoveEvaluation(index)}
                    disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSubmitFinal}
            disabled={listaEvaluaciones.length === 0 || isSubmitting}
            style={{
              opacity: listaEvaluaciones.length === 0 || isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Actualizando MEGA...
              </>
            ) : (
              <>
                <Save size={16} /> Enviar Lista a MEGA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
