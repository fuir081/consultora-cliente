import styles from "./bienvenida.module.css";
import Calendario from "@/assets/img/calendario.png";

export default function Bienvenida() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const nombreUsuario = user.representativeName ?? "Usuario";

  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className={styles.bienvenida}>
      <h1>
        Hola, <span>{nombreUsuario}</span>
      </h1>

      <p>Bienvenido al Sistema de Gestión Documental.</p>

      <span>
        <img src={Calendario} alt="calendario bienvenida" />
        {fecha}
      </span>
    </section>
  );
}
