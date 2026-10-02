// src/pages/formularios/formularios.tsx
import { useState, useEffect } from "react";
import {
  Calendar,
  PackageCheck,
  Users,
  Droplets,
  Thermometer,
  Truck,
  Cake,
  Layers,
  Wheat,
  Sparkles,
  Cookie,
  IceCream,
  ChevronRight,
} from "lucide-react";
import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";
import styles from "./formularios.module.css";

import MmppModal from "./mmpp/mmpp";
import HigieneModal from "./higiene/higiene";
import LimpiezaModal from "./limpieza/limpieza";
import LimpiezaAlmacenamientoModal from "./limpiezaAlmacenamiento/limpiezaAlmacenamiento";
import LimpiezaChocolatesModal from "./limpiezaChocolates/limpiezaChocolates";
import LimpiezaHeladosModal from "./limpiezaHelados/limpiezaHelados";
import TemperaturaModal from "./temperatura/temperatura";
import VehiculoModal from "./vehiculo/vehiculo";
import BizcochosFinalModal from "./bizcochoFinal/bizcochoFinal";
import BizcochosFinalBModal from "./bizcochoFinalB/bizcochosFinalB";
import ProductosIntermediosModal from "./productosIntermedios/productosIntermedios";
import MixHarinasModal from "./mixHarinas/mixHarinas";

interface FormularioItem {
  id: string;
  titulo: string;
  categoria: string;
  estado: "pendiente" | "completado";
  frecuencia: string;
  icon: any;
  colorClass: string;
}

const baseFormularios: FormularioItem[] = [
  {
    id: "mmpp",
    titulo: "Recepción MMPP e insumos",
    categoria: "Recepción",
    estado: "pendiente",
    frecuencia: "Por lote",
    icon: PackageCheck,
    colorClass: styles.textBlue,
  },
  {
    id: "higiene",
    titulo: "Registro de Higiene Personal",
    categoria: "Personal",
    estado: "pendiente",
    frecuencia: "Diario",
    icon: Users,
    colorClass: styles.textOrange,
  },
  {
    id: "limpieza",
    titulo: "Limpieza y Sanitización (Sala Horneo y Prod.)",
    categoria: "POES",
    estado: "pendiente",
    frecuencia: "Diario",
    icon: Droplets,
    colorClass: styles.textGreen,
  },
  {
    id: "limpieza_almacenamiento",
    titulo: "Limpieza y Sanitización (Almacenamiento)",
    categoria: "POES",
    estado: "pendiente",
    frecuencia: "Diario",
    icon: Sparkles,
    colorClass: styles.textBlue,
  },
  {
    id: "limpieza_chocolates",
    titulo: "Limpieza y Sanitización (Armado y Bañado Chocolate)",
    categoria: "POES",
    estado: "pendiente",
    frecuencia: "Diario",
    icon: Cookie,
    colorClass: styles.textOrange,
  },
  {
    id: "limpieza_helados",
    titulo: "Limpieza y Sanitización (Helados y Barquillos)",
    categoria: "POES",
    estado: "pendiente",
    frecuencia: "Diario",
    icon: IceCream,
    colorClass: styles.textPurple,
  },
  {
    id: "temperatura",
    titulo: "Control de Temperatura Almacenamiento",
    categoria: "HACCP",
    estado: "pendiente",
    frecuencia: "Mañana y Tarde",
    icon: Thermometer,
    colorClass: styles.textPurple,
  },
  {
    id: "vehiculo",
    titulo: "Temperatura Vehículo de Transporte",
    categoria: "Logística",
    estado: "pendiente",
    frecuencia: "Por despacho",
    icon: Truck,
    colorClass: styles.textBlue,
  },
  {
    id: "bizcochos_final",
    titulo: "Prod. y Trazabilidad: Bizcochos Rellenos",
    categoria: "Producción",
    estado: "pendiente",
    frecuencia: "Por lote",
    icon: Cake,
    colorClass: styles.textOrange,
  },
  {
    id: "bizcochos_final_b",
    titulo: "Prod. y Trazabilidad: Bizcochos Rellenos B",
    categoria: "Producción",
    estado: "pendiente",
    frecuencia: "Por lote",
    icon: Cake,
    colorClass: styles.textPurple,
  },
  {
    id: "productos_intermedios",
    titulo: "Prod. y Trazabilidad: Productos Intermedios",
    categoria: "Producción",
    estado: "pendiente",
    frecuencia: "Por lote",
    icon: Layers,
    colorClass: styles.textBlue,
  },
  {
    id: "mix_harinas",
    titulo: "Prod. MIX Harinas y Aditivos",
    categoria: "Producción",
    estado: "pendiente",
    frecuencia: "Por lote",
    icon: Wheat,
    colorClass: styles.textGreen,
  },
];

export default function GestionFormularios() {
  const [open, setOpen] = useState(false);
  const [modalActivo, setModalActivo] = useState<string | null>(null);
  const [formularios, setFormularios] =
    useState<FormularioItem[]>(baseFormularios);

  const checkPendientes = () => {
    const hoy = new Date().toLocaleDateString();

    const actualizados = baseFormularios.map((form) => {
      const lastCompleted = localStorage.getItem(`form_${form.id}_last_date`);

      let estadoActual: "pendiente" | "completado" = "pendiente";
      if (lastCompleted === hoy) {
        estadoActual = "completado";
      }

      return { ...form, estado: estadoActual };
    });

    setFormularios(actualizados);
  };

  useEffect(() => {
    checkPendientes();
  }, []);

  // Lógica para agrupar los formularios por su categoría
  const formulariosAgrupados = formularios.reduce(
    (acc, form) => {
      if (!acc[form.categoria]) {
        acc[form.categoria] = [];
      }
      acc[form.categoria].push(form);
      return acc;
    },
    {} as Record<string, FormularioItem[]>,
  );

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={styles.mainContainer}>
        <section className={styles.bienvenida}>
          <div>
            <h1>
              Central de <span>Formularios</span>
            </h1>
            <h3>
              Digitalización y control de registros normativos de calidad.
            </h3>
            <p className={styles.fechaActual}>
              <Calendar size={14} /> Gestión Diaria:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className={styles.listaContainer}>
          {/* Iteramos sobre el objeto de categorías agrupadas */}
          {Object.entries(formulariosAgrupados).map(([categoria, forms]) => (
            <div key={categoria} className={styles.categoriaGroup}>
              <h3 className={styles.categoriaTitulo}>{categoria}</h3>
              <div className={styles.categoriaForms}>
                {forms.map((form) => {
                  const Icon = form.icon;
                  return (
                    <div
                      key={form.id}
                      className={styles.rowCard}
                      onClick={() => setModalActivo(form.id)}
                    >
                      <div className={styles.rowLeft}>
                        <div className={styles.rowIcon}>
                          <Icon size={20} className={form.colorClass} />
                        </div>
                        <div>
                          <h4>{form.titulo}</h4>
                          <span className={styles.subCategoria}>
                            {form.frecuencia}
                          </span>
                        </div>
                      </div>
                      <div className={styles.rowRight}>
                        <span
                          className={`${styles.badgeStatus} ${
                            form.estado === "completado"
                              ? styles.badgeCompleted
                              : styles.badgePending
                          }`}
                        >
                          {form.estado === "completado"
                            ? "Realizada"
                            : "Falta realizar"}
                        </span>
                        <ChevronRight size={18} className={styles.arrowIcon} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Renderizado de Modales */}
      <MmppModal
        isOpen={modalActivo === "mmpp"}
        onClose={() => setModalActivo(null)}
      />
      <HigieneModal
        isOpen={modalActivo === "higiene"}
        onClose={() => setModalActivo(null)}
        onSuccess={checkPendientes}
      />
      <LimpiezaModal
        isOpen={modalActivo === "limpieza"}
        onClose={() => setModalActivo(null)}
      />
      <LimpiezaAlmacenamientoModal
        isOpen={modalActivo === "limpieza_almacenamiento"}
        onClose={() => setModalActivo(null)}
      />
      <LimpiezaChocolatesModal
        isOpen={modalActivo === "limpieza_chocolates"}
        onClose={() => setModalActivo(null)}
      />
      <LimpiezaHeladosModal
        isOpen={modalActivo === "limpieza_helados"}
        onClose={() => setModalActivo(null)}
      />
      <TemperaturaModal
        isOpen={modalActivo === "temperatura"}
        onClose={() => setModalActivo(null)}
      />
      <VehiculoModal
        isOpen={modalActivo === "vehiculo"}
        onClose={() => setModalActivo(null)}
      />
      <BizcochosFinalModal
        isOpen={modalActivo === "bizcochos_final"}
        onClose={() => setModalActivo(null)}
      />
      <BizcochosFinalBModal
        isOpen={modalActivo === "bizcochos_final_b"}
        onClose={() => setModalActivo(null)}
      />
      <ProductosIntermediosModal
        isOpen={modalActivo === "productos_intermedios"}
        onClose={() => setModalActivo(null)}
      />
      <MixHarinasModal
        isOpen={modalActivo === "mix_harinas"}
        onClose={() => setModalActivo(null)}
      />
    </>
  );
}
