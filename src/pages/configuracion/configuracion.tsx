import { useState } from "react";
import { Bell, Shield, Palette, Save } from "lucide-react";
import styles from "./configuracion.module.css";

import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";

export default function Configuracion() {
  const [open, setOpen] = useState(false);

  // Estados simples de configuración
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [tema, setTema] = useState("claro");

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={styles.mainContainer}>
        <section className={styles.bienvenida}>
          <div>
            <h1>Configuración</h1>
            <h3>
              Ajusta las preferencias generales de tu cuenta y del sistema
            </h3>
          </div>
        </section>

        <div className={styles.cardContainer}>
          {/* Notificaciones */}
          <div className={styles.configSection}>
            <div className={styles.configHeader}>
              <Bell size={20} className={styles.sectionIcon} />
              <div>
                <h2>Notificaciones</h2>
                <p>Elige de qué manera quieres recibir las alertas</p>
              </div>
            </div>
            <div className={styles.rowToggle}>
              <span>Alertas por Correo Electrónico</span>
              <input
                type="checkbox"
                checked={notificacionesEmail}
                onChange={(e) => setNotificacionesEmail(e.target.checked)}
              />
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Apariencia */}
          <div className={styles.configSection}>
            <div className={styles.configHeader}>
              <Palette size={20} className={styles.sectionIcon} />
              <div>
                <h2>Apariencia</h2>
                <p>Personaliza la interfaz visual</p>
              </div>
            </div>
            <div className={styles.rowSelect}>
              <span>Tema de la aplicación</span>
              <select value={tema} onChange={(e) => setTema(e.target.value)}>
                <option value="claro">Modo Claro (Por defecto)</option>
                <option value="oscuro">Modo Oscuro</option>
              </select>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Seguridad */}
          <div className={styles.configSection}>
            <div className={styles.configHeader}>
              <Shield size={20} className={styles.sectionIcon} />
              <div>
                <h2>Seguridad</h2>
                <p>Opciones de contraseña y autenticación</p>
              </div>
            </div>
            <button className={styles.btnSecondary}>Cambiar Contraseña</button>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.btnPrimary}
              onClick={() => alert("Configuraciones guardadas")}
            >
              <Save size={16} />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
