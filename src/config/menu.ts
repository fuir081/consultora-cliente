export interface MenuItem {
  title: string;
  path: string;
}
export const adminMenu: MenuItem[] = [
  {
    title: "Panel de Control",
    path: "/dashboard",
  },
  {
    title: "Documentos",
    path: "/documentos",
  },
  {
    title: "Carpetas",
    path: "/carpetas",
  },
  {
    title: "Actividad",
    path: "/actividad",
  },
  {
    title: "Versiones",
    path: "/versiones",
  },
  {
    title: "Usuarios",
    path: "/usuarios",
  },
  {
    title: "Configuración",
    path: "/configuracion",
  },
];

export const userMenu: MenuItem[] = [
  {
    title: "Documentos",
    path: "/documentos",
  },
  {
    title: "Carpetas",
    path: "/carpetas",
  },
];
