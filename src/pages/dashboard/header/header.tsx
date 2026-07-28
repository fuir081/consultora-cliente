import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickOutside from "@/hooks/useClickOutside";

import styles from "./header.module.css";
import logo from "@/assets/img/imagelogo.png";
import lupa from "@/assets/img/busqueda-de-lupa.png";
import bell from "@/assets/img/campana.png";
import usuario from "@/assets/img/usuario.png";

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  useClickOutside(notificationRef, () => {
    setShowNotifications(false);
  });

  useClickOutside(userRef, () => {
    setShowUserMenu(false);
  });

  useClickOutside(menuRef, () => {
    setOpen(false);
  });

  return (
    <header className={styles.header}>
      <div className={styles.menuContainer} ref={menuRef}>
        {/* Botón hamburguesa */}
        <button
          className={`${styles.hamburger} ${open ? styles.open : ""}`}
          onClick={() => {
            setOpen(!open);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú */}
        {open && (
          <div className={styles.overlay} onClick={() => setOpen(false)} />
        )}

        <nav className={`${styles.menu} ${open ? styles.active : ""}`}>
          <a href="#inicio">Panel de Control</a>
          <a href="#servicios">Documentos</a>
          <a href="#nosotros">Carpetas</a>
          <a href="#contacto">Actividad</a>
          <a href="#">Versiones</a>
          <a href="#">Usuario</a>
          <a href="#">Configuración</a>
        </nav>
      </div>
      <img src={logo} alt="imagelogo consultora alimentate" />
      <div className={styles.contenedor}>
        <div>
          <form className={styles.search}>
            <input type="text" placeholder="Buscar documentos..." />
            <button type="submit">
              <img src={lupa} alt="boton de lupara para busqueda" />
            </button>
          </form>
        </div>
        <div
          className={styles.notificacion}
          ref={notificationRef}
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowUserMenu(false);
            setOpen(false);
          }}
        >
          <span className={styles.num}>3</span>
          <img src={bell} alt="campana de notificación consultora" />

          {showNotifications && (
            <div className={styles.dropdown}>
              <ul>
                <li>
                  <h2>Notificación 1</h2>
                  <h3>Información de notificación</h3>
                  <span>01/02/2026</span>
                </li>

                <li>
                  <h2>Notificación 2</h2>
                  <h3>Información de notificación</h3>
                  <span>01/01/2026</span>
                </li>

                <li>
                  <h2>Notificación 3</h2>
                  <h3>Información de notificación</h3>
                  <span>01/06/2026</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div
          ref={userRef}
          className={styles.usuario}
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
            setOpen(false);
          }}
        >
          <div>
            <img src={usuario} alt="logo usuario" />
          </div>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <ul>
                <li>Mi perfil</li>
                <li>Configuración</li>
                <li onClick={handleLogout}>Cerrar sesión</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
