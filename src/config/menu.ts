import PanelControl from "@/assets/img/panel-inicio.png";
import DocumentoMenu from "@/assets/img/documentoMenu.png";
import UsuarioMenu from "@/assets/img/usuarioMenu.png";
import ConfiguracionMenu from "@/assets/img/configuracion.png";
import formulario from "@/assets/img/formulario.png";
import ProductosMenu from "@/assets/img/agregar-producto.png";
import ProveedoresMenu from "@/assets/img/proveedor.png";

export interface MenuItem {
  title: string;
  path: string;
  img: string;
  info: string;
}
export const adminMenu: MenuItem[] = [
  {
    title: "Panel de Control",
    path: "/dashboard",
    img: PanelControl,
    info: "Panel de control",
  },
  {
    title: "Documentos",
    path: "/documentos",
    img: DocumentoMenu,
    info: "Documentos",
  },
  {
    title: "Formularios",
    path: "/formularios",
    img: formulario,
    info: "Formularios",
  },
  {
    title: "Productos",
    path: "/productos",
    img: ProductosMenu,
    info: "Productos",
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    img: UsuarioMenu,
    info: "Usuarios",
  },
  {
    title: "Proveedores",
    path: "/proveedores",
    img: ProveedoresMenu,
    info: "Proveedores",
  },
  {
    title: "Configuración",
    path: "/configuracion",
    img: ConfiguracionMenu,
    info: "Configuración",
  },
];

export const userMenu: MenuItem[] = [
  {
    title: "Panel de Control",
    path: "/dashboard",
    img: PanelControl,
    info: "Panel de control",
  },
  {
    title: "Documentos",
    path: "/documentos",
    img: DocumentoMenu,
    info: "Documentos",
  },
  {
    title: "Formularios",
    path: "/formularios",
    img: formulario,
    info: "Formularios",
  },
];
