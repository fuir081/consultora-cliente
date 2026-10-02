import { useState } from "react";
import {
  User,
  Building,
  Upload,
  Save,
  Lock,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle,
} from "lucide-react";
import styles from "./perfil.module.css";

import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";

export default function Perfil() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "empresa">(
    "personal",
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estado Formulario Datos Personales
  const [personalData, setPersonalData] = useState({
    nombre: "Fernando Test",
    email: "fernando@test.com",
    telefono: "+56 9 1234 5678",
    cargo: "Administrador General",
  });

  // Estado Formulario Datos Empresa
  const [empresaData, setEmpresaData] = useState({
    razonSocial: "Consultora e Inversiones SpA",
    rut: "76.123.456-7",
    direccion: "Av. Providencia 1234, Oficina 601",
    telefonoContacto: "+56 2 2987 6543",
    sitioWeb: "www.consultora.cl",
  });

  // Logo de la empresa (vista previa)
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={styles.mainContainer}>
        {/* Encabezado */}
        <section className={styles.bienvenida}>
          <div>
            <h1>Mi Perfil</h1>
            <h3>
              Administra tu información personal y los datos institucionales
            </h3>
          </div>
          {savedSuccess && (
            <div className={styles.toastSuccess}>
              <CheckCircle size={16} />
              <span>Cambios guardados correctamente</span>
            </div>
          )}
        </section>

        {/* Selector de Pestañas (Tabs) */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "personal" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={18} />
            <span>Información Personal</span>
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "empresa" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("empresa")}
          >
            <Building size={18} />
            <span>Datos de la Empresa</span>
          </button>
        </div>

        {/* TAB 1: INFORMACIÓN PERSONAL */}
        {activeTab === "personal" && (
          <form onSubmit={handleSave} className={styles.cardContainer}>
            <div className={styles.sectionHeader}>
              <h2>Datos del Usuario</h2>
              <p>Actualiza tus nombres, correo y teléfono de contacto</p>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  <User size={14} /> Nombre Completo
                </label>
                <input
                  type="text"
                  value={personalData.nombre}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Mail size={14} /> Correo Electrónico
                </label>
                <input
                  type="email"
                  value={personalData.email}
                  onChange={(e) =>
                    setPersonalData({ ...personalData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Phone size={14} /> Teléfono
                </label>
                <input
                  type="text"
                  value={personalData.telefono}
                  onChange={(e) =>
                    setPersonalData({
                      ...personalData,
                      telefono: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Lock size={14} /> Cargo / Rol
                </label>
                <input
                  type="text"
                  value={personalData.cargo}
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>
                <Save size={16} />
                <span>Guardar Datos Personales</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: DATOS DE LA EMPRESA */}
        {activeTab === "empresa" && (
          <form onSubmit={handleSave} className={styles.cardContainer}>
            <div className={styles.sectionHeader}>
              <h2>Información Institucional</h2>
              <p>
                Configura el logo y la razón social que aparecerán en los
                reportes
              </p>
            </div>

            {/* Cargar / Cambiar Logo */}
            <div className={styles.logoSection}>
              <div className={styles.logoPreviewBox}>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Empresa"
                    className={styles.logoImg}
                  />
                ) : (
                  <Building size={32} className={styles.logoIconPlaceholder} />
                )}
              </div>
              <div className={styles.logoActions}>
                <label htmlFor="logoInput" className={styles.btnSecondary}>
                  <Upload size={16} />
                  <span>Cargar Logo</span>
                </label>
                <input
                  type="file"
                  id="logoInput"
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={handleLogoChange}
                />
                <span className={styles.logoHint}>
                  Soporta formatos PNG, JPG (Recomendado 300x300 px)
                </span>
              </div>
            </div>

            {/* Campos de la Empresa */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Razón Social / Nombre Comercial</label>
                <input
                  type="text"
                  value={empresaData.razonSocial}
                  onChange={(e) =>
                    setEmpresaData({
                      ...empresaData,
                      razonSocial: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>RUT / Identificación Fiscal</label>
                <input
                  type="text"
                  value={empresaData.rut}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, rut: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <MapPin size={14} /> Dirección Matriz
                </label>
                <input
                  type="text"
                  value={empresaData.direccion}
                  onChange={(e) =>
                    setEmpresaData({
                      ...empresaData,
                      direccion: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Phone size={14} /> Teléfono Comercial
                </label>
                <input
                  type="text"
                  value={empresaData.telefonoContacto}
                  onChange={(e) =>
                    setEmpresaData({
                      ...empresaData,
                      telefonoContacto: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <Globe size={14} /> Sitio Web
                </label>
                <input
                  type="text"
                  value={empresaData.sitioWeb}
                  onChange={(e) =>
                    setEmpresaData({ ...empresaData, sitioWeb: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.btnPrimary}>
                <Save size={16} />
                <span>Guardar Datos de la Empresa</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
