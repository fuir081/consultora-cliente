import { Link } from "react-router-dom";
import { adminMenu, userMenu } from "@/config/menu";
import styles from "./sideBar.module.css";
import logo from "@/assets/img/imagelogo.png";

interface SideBarProps {
  open: boolean;
}

export default function SideBar({ open }: SideBarProps) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Si el rol es SYSADMIN o ADMIN, cargamos el menú de administración.
  // De lo contrario, cargamos el menú de usuario normal.
  const menu = ["SYSADMIN", "ADMIN"].includes(user.role) ? adminMenu : userMenu;

  return (
    <nav className={`${styles.menu} ${open ? styles.active : ""}`}>
      <img
        src={logo}
        alt="logo consultora alimentate"
        className={styles.logo}
      />

      <h1>Menú</h1>

      {menu.map((item) => (
        <Link key={item.path} to={item.path} title={item.info}>
          <img src={item.img} alt="imágenes iconos para menú consultora" />
          <span>{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
