import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useClickOutside from "@/hooks/useClickOutside";

import styles from "./header.module.css";

import lupa from "@/assets/img/busqueda-de-lupa.png";
import bell from "@/assets/img/campana.png";
import usuarioHeader from "@/assets/img/usuarioHeader.png";
import flechaAbajo from "@/assets/img/flecha-hacia-abajo-para-navegar.png";

import { Link } from "react-router-dom";

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ open, setOpen }: HeaderProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const nombreUsuario = user.name ?? user.representativeName ?? "Usuario";

  // Si el rol es "ADMIN", guarda "administrador"; de lo contrario, usa el rol existente o "Rol"
  const rol = user.role === "ADMIN" ? "Administrador" : (user.role ?? "Rol");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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
        <button
          className={`${styles.hamburger} ${open ? styles.open : ""}`}
          onClick={() => {
            setOpen((prev) => !prev);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {open && (
          <div className={styles.overlay} onClick={() => setOpen(false)} />
        )}
      </div>

      <div className={styles.contenedor}>
        <form className={styles.search}>
          <input type="text" placeholder="Buscar documentos..." />

          <button type="submit">
            <img src={lupa} alt="botón de lupa para búsqueda" />
          </button>
        </form>

        <div className={styles.contenedorFinalHeader}>
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
              <img src={usuarioHeader} alt="logo usuario" />
              <div className={styles.infoUsuario}>
                <h2>{nombreUsuario} </h2>
                <span>{rol}</span>
                <img
                  src={flechaAbajo}
                  className={styles.flecha}
                  alt="flecha usuario consultora alimentate"
                />
              </div>
            </div>

            {showUserMenu && (
              <div className={styles.dropdown}>
                <ul>
                  <Link to={"/perfil"}>
                    <li>Mi perfil</li>
                  </Link>
                  <Link to="/configuracion">
                    <li>Configuración</li>
                  </Link>

                  <li onClick={handleLogout}>Cerrar sesión</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
