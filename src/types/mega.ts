export interface MegaItem {
  id: string;
  nombre: string;
  tipo: "folder" | "file";
  tamaño: number;
  fecha: number;
}
