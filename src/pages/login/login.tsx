import { useState } from "react";
import { validateLogin } from "../../utils/validators";
import { Link } from "react-router-dom";

import styles from "./login.module.css";
import logo from "../../assets/img/logo.png";
import fondoLogin from "../../assets/img/inocuidad-alimentaria.png";

import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateLogin(email, password);

    if (error) {
      alert(error);
      return;
    }

    try {
      const data = await login(email, password);

      console.log(data);

      localStorage.setItem("token", data.accessToken);

      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error: any) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      alert("Correo o contraseña incorrectos");
    }
  };

  return (
    <section className={styles.page}>
      <div>
        <div className={styles.formContainer}>
          <img src={logo} alt="logo consultora alimentate" />
          <h1>Iniciar Sesión</h1>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Correo electrónico:</label>
              <input
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Ingresar
            </button>
          </form>

          <div className={styles.recuperarPass}>
            <Link to="/recuperar-clave">Recuperar contraseña</Link>
          </div>
        </div>
        <div
          className={styles.formImgContainer}
          style={{
            backgroundImage: `url(${fondoLogin})`,
          }}
        >
          <h2>Capacitación y asesoría para la industria alimentaria</h2>
        </div>
      </div>
    </section>
  );
}
