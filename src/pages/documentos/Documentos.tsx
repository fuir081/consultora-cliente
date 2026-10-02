import { useEffect, useState, ChangeEvent } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Download,
  Pencil,
  Trash2,
  X,
  FileText,
  FileSpreadsheet,
  FileCode,
  Folder,
  FolderOpen,
  Home,
  Upload,
  MoreVertical,
  ArrowUpDown,
} from "lucide-react";
import styles from "./documentos.module.css";

import { MegaItem } from "@/types/mega";
import {
  getFolder,
  downloadFile,
  uploadFileToMega,
  deleteMegaItem,
} from "@/services/mega.service";

import Header from "@/pages/dashboard/header/header";
import SideBar from "../dashboard/sideBar/sideBar";
import ExcelEditor from "./excelEditor/excelEditor";

export default function Documentos() {
  const [open, setOpen] = useState(false);

  // 1. Obtenemos el usuario logueado del localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 2. Extraemos el megaNodeId de su empresa. Si no tiene, usamos uno por defecto o vacío.
  // (Asumiendo que el objeto user trae la relación 'company' con su 'megaNodeId')
  const userMegaNodeId = user.company?.megaNodeId;

  // Si por alguna razón el usuario no tiene la empresa en localStorage,
  // mostramos una advertencia en consola para saber que debes volver a loguearte
  if (!userMegaNodeId) {
    console.warn(
      "⚠️ El usuario actual no tiene un 'megaNodeId' en el localStorage. Por favor, cierra sesión y vuelve a iniciar sesión.",
    );
  }

  const ROOT_FOLDER = userMegaNodeId || "IrZkXTQD"; // Respaldo temporal

  const [items, setItems] = useState<MegaItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<MegaItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Estado para el archivo Excel en proceso de edición
  const [editingExcelFile, setEditingExcelFile] = useState<MegaItem | null>(
    null,
  );

  // Estados de Filtro y vista
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: string; nombre: string }[]
  >([{ id: ROOT_FOLDER, nombre: user.company?.razonSocial || "Mi Empresa" }]);

  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  useEffect(() => {
    if (ROOT_FOLDER) {
      cargarCarpeta(ROOT_FOLDER);
    }
  }, [ROOT_FOLDER]);

  const cargarCarpeta = async (nodeId: string, nombre?: string) => {
    try {
      const data = await getFolder(nodeId);
      setItems(data);
      setSelectedIds([]);

      if (nombre && !breadcrumbs.some((b) => b.id === nodeId)) {
        setBreadcrumbs((prev) => [...prev, { id: nodeId, nombre }]);
      }
    } catch (error) {
      console.error("Error cargando carpeta de MEGA:", error);
    }
  };

  // Helper Excel
  const isExcelFile = (nombre: string) => {
    const ext = nombre.split(".").pop()?.toLowerCase();
    return ext === "xlsx" || ext === "xls" || ext === "csv";
  };

  const renderFileIcon = (nombre: string) => {
    if (isExcelFile(nombre))
      return <FileSpreadsheet className={styles.iconExcel} size={20} />;
    const ext = nombre.split(".").pop()?.toLowerCase();
    if (ext === "txt" || ext === "doc" || ext === "docx")
      return <FileText className={styles.iconText} size={20} />;
    return <FileCode className={styles.iconDefault} size={20} />;
  };

  const getFileTypeLabel = (nombre: string) => {
    const ext = nombre.split(".").pop()?.toUpperCase();
    return ext ? `${ext}` : "Documento";
  };

  // Subida de Archivos
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileToUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadSubmit = async () => {
    if (!fileToUpload) return;
    setIsUploading(true);

    try {
      const nuevoArchivo = await uploadFileToMega(
        fileToUpload,
        currentFolderId,
      );
      setItems((prev) => [nuevoArchivo, ...prev]);
      setIsUploadModalOpen(false);
      setFileToUpload(null);
    } catch (error) {
      console.error("Error al subir archivo a MEGA:", error);
      alert("Hubo un error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  // MANEJADOR PARA GUARDAR EXCEL EDITADO EN MEGA
  const handleSaveExcel = async (fileToReplace: File) => {
    if (!editingExcelFile) return;

    try {
      const itemActualizado = await uploadFileToMega(
        fileToReplace,
        currentFolderId,
        editingExcelFile.id,
      );

      setItems((prev) =>
        prev.map((i) => (i.id === editingExcelFile.id ? itemActualizado : i)),
      );

      alert(`El archivo ${editingExcelFile.nombre} se actualizó en MEGA.`);
      setEditingExcelFile(null);
    } catch (error) {
      console.error("Error al actualizar Excel en MEGA:", error);
      alert("No se pudo guardar la actualización en MEGA.");
    }
  };

  // MANEJADOR PARA ELIMINAR ARCHIVO EN MEGA
  const handleDeleteFile = async (nodeId: string) => {
    if (
      !confirm("¿Deseas eliminar este archivo de MEGA de forma permanente?")
    ) {
      return;
    }

    try {
      await deleteMegaItem(nodeId);
      setItems((prev) => prev.filter((item) => item.id !== nodeId));
      setSelectedFile(null);
      setSelectedIds((prev) => prev.filter((id) => id !== nodeId));
    } catch (error) {
      console.error("Error al eliminar elemento de MEGA:", error);
      alert("No se pudo eliminar el elemento.");
    }
  };

  // Selección Múltiple
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(itemsFiltrados.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const itemsFiltrados = items.filter((item) => {
    const coincideNombre = item.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterType === "folder")
      return coincideNombre && item.tipo === "folder";
    if (filterType === "file") return coincideNombre && item.tipo === "file";
    return coincideNombre;
  });

  const tieneArchivos = itemsFiltrados.some((item) => item.tipo === "file");
  const tieneCarpetas = itemsFiltrados.some((item) => item.tipo === "folder");

  return (
    <>
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} />

      <main className={styles.mainContainer}>
        {/* Encabezado */}
        <section className={styles.bienvenida}>
          <div>
            <h1>Documentos</h1>
            <h3>
              Gestiona todos los procedimientos, registros y manuales de{" "}
              {user.company?.razonSocial || "la empresa"}
            </h3>
          </div>
          <div className={styles.botones}>
            <button
              className={styles.btnPrimary}
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload size={16} />
              <span>Subir Archivo</span>
            </button>
          </div>
        </section>

        {/* Breadcrumbs */}
        <section className={styles.panelInfo}>
          <Home size={16} className={styles.homeIcon} />
          {breadcrumbs.map((item, index) => (
            // Añadimos el índice a la key para garantizar que sea 100% única
            <div key={`${item.id}-${index}`} className={styles.breadcrumbItem}>
              <a
                onClick={() => {
                  cargarCarpeta(item.id);
                  setBreadcrumbs(breadcrumbs.slice(0, index + 1));
                }}
              >
                {item.nombre}
              </a>
              {index < breadcrumbs.length - 1 && (
                <span className={styles.separator}>/</span>
              )}
            </div>
          ))}
        </section>

        {/* Barra de Herramientas */}
        <section className={styles.toolbarContainer}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar en esta carpeta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.toolbarActions}>
            <button type="button" className={styles.btnAction}>
              <SlidersHorizontal size={16} />
              <span>Filtros</span>
            </button>

            <div className={styles.selectWrapper}>
              <select
                className={`${styles.btnAction} ${styles.selectType}`}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tipo</option>
                <option value="folder">Carpetas</option>
                <option value="file">Archivos</option>
              </select>
              <ChevronDown className={styles.selectArrow} size={16} />
            </div>

            <div className={styles.viewToggleContainer}>
              <button
                type="button"
                className={`${styles.btnToggle} ${
                  viewMode === "grid" ? styles.active : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                className={`${styles.btnToggle} ${
                  viewMode === "list" ? styles.active : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Barra de Acción Múltiple */}
        {selectedIds.length > 0 && (
          <div className={styles.bulkActionBar}>
            <span>{selectedIds.length} elementos seleccionados</span>
            <div className={styles.bulkButtons}>
              <button className={styles.btnBulkAction}>
                <Download size={16} /> Descargar
              </button>
              <button
                className={`${styles.btnBulkAction} ${styles.btnBulkDelete}`}
                onClick={async () => {
                  if (
                    confirm(
                      `¿Eliminar definitivamente ${selectedIds.length} elementos?`,
                    )
                  ) {
                    for (const id of selectedIds) {
                      await deleteMegaItem(id);
                    }
                    setItems((prev) =>
                      prev.filter((i) => !selectedIds.includes(i.id)),
                    );
                    setSelectedIds([]);
                  }
                }}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        )}

        {/* Carpetas */}
        {tieneCarpetas && (
          <div className={styles.sectionTitle}>
            <span>
              Carpetas (
              {itemsFiltrados.filter((i) => i.tipo === "folder").length})
            </span>
          </div>
        )}
        {tieneCarpetas && (
          <section
            className={
              viewMode === "grid"
                ? styles.panelDocumentosGrid
                : styles.panelDocumentosList
            }
          >
            {itemsFiltrados
              .filter((item) => item.tipo === "folder")
              .map((folder) => (
                <div
                  key={folder.id}
                  className={
                    viewMode === "grid"
                      ? styles.folderCard
                      : styles.folderListItem
                  }
                  onClick={() => cargarCarpeta(folder.id, folder.nombre)}
                >
                  <Folder className={styles.folderIcon} size={24} />
                  <div className={styles.folderDetails}>
                    <span className={styles.folderName}>{folder.nombre}</span>
                    <span className={styles.folderDate}>
                      {new Date(folder.fecha * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </section>
        )}

        {/* Tabla de Archivos */}
        {tieneArchivos && (
          <div className={styles.sectionTitle}>
            <span>
              Archivos ({itemsFiltrados.filter((i) => i.tipo === "file").length}
              )
            </span>
          </div>
        )}
        {tieneArchivos && (
          <section className={styles.tablaContainer}>
            <table className={styles.tablaDocumentos}>
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === itemsFiltrados.length
                      }
                    />
                  </th>
                  <th>
                    <div className={styles.thWithSort}>
                      Nombre <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th>Tipo</th>
                  <th>Tamaño</th>
                  <th>Modificado</th>
                  <th>Subido por</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {itemsFiltrados
                  .filter((item) => item.tipo === "file")
                  .map((file) => {
                    const isSelected = selectedIds.includes(file.id);
                    return (
                      <tr
                        key={file.id}
                        className={`${styles.rowFile} ${
                          isSelected ? styles.rowSelected : ""
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <td onClick={(e) => handleSelectOne(file.id, e)}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                          />
                        </td>
                        <td className={styles.fileNameCell}>
                          {renderFileIcon(file.nombre)}
                          <span>{file.nombre}</span>
                        </td>
                        <td>
                          <span className={styles.badgeType}>
                            {getFileTypeLabel(file.nombre)}
                          </span>
                        </td>
                        <td>{(file.tamaño / 1024).toFixed(1)} KB</td>
                        <td>
                          {new Date(file.fecha * 1000).toLocaleDateString()}
                        </td>
                        <td>{user.company?.razonSocial || "Empresa"}</td>
                        <td
                          style={{ textAlign: "right" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className={styles.actionCell}>
                            {isExcelFile(file.nombre) && (
                              <button
                                className={styles.btnIconAction}
                                onClick={() => setEditingExcelFile(file)}
                                title="Editar Hoja"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            <button
                              className={styles.btnIconAction}
                              onClick={() => downloadFile(file.id, file.nombre)}
                              title="Descargar"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className={styles.btnIconAction}
                              onClick={() => handleDeleteFile(file.id)}
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>
        )}

        {/* Empty State */}
        {!tieneCarpetas && !tieneArchivos && (
          <div className={styles.emptyState}>
            <FolderOpen size={48} className={styles.emptyIcon} />
            <h3>Esta carpeta está vacía</h3>
            <p>No hay archivos ni subcarpetas para mostrar aquí.</p>
            <button
              className={styles.btnPrimary}
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload size={16} />
              <span>Subir el primer archivo</span>
            </button>
          </div>
        )}
      </main>

      {/* Modal Subida */}
      {isUploadModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            if (!isUploading) {
              setIsUploadModalOpen(false);
              setFileToUpload(null);
            }
          }}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => {
                setIsUploadModalOpen(false);
                setFileToUpload(null);
              }}
              disabled={isUploading}
            >
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <h2>Subir Archivo</h2>
              <p className={styles.modalSubtitle}>
                El archivo se guardará en la carpeta actual
              </p>
            </div>

            <div className={styles.modalBody}>
              <div
                className={styles.dropZone}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload size={32} className={styles.dropIcon} />
                <p className={styles.dropText}>
                  Arrastra tu archivo aquí o{" "}
                  <label htmlFor="fileInput" className={styles.browseLabel}>
                    examina
                  </label>
                </p>
                <input
                  type="file"
                  id="fileInput"
                  className={styles.hiddenFileInput}
                  onChange={handleFileChange}
                />
              </div>

              {fileToUpload && (
                <div className={styles.selectedFileBox}>
                  <div className={styles.selectedFileInfo}>
                    <FileText size={20} className={styles.iconText} />
                    <div className={styles.selectedFileDetails}>
                      <span className={styles.selectedFileName}>
                        {fileToUpload.name}
                      </span>
                      <span className={styles.selectedFileSize}>
                        {(fileToUpload.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.removeFileBtn}
                    onClick={() => setFileToUpload(null)}
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setFileToUpload(null);
                }}
                disabled={isUploading}
              >
                Cancelar
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleUploadSubmit}
                disabled={!fileToUpload || isUploading}
              >
                {isUploading ? "Subiendo..." : "Confirmar Subida"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {selectedFile && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedFile(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setSelectedFile(null)}
            >
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.fileIconWrapper}>
                {renderFileIcon(selectedFile.nombre)}
              </div>
              <h2>{selectedFile.nombre}</h2>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.infoRow}>
                <span>Tipo:</span>
                <strong>{getFileTypeLabel(selectedFile.nombre)}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Tamaño:</span>
                <strong>{(selectedFile.tamaño / 1024).toFixed(1)} KB</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Modificado:</span>
                <strong>
                  {new Date(selectedFile.fecha * 1000).toLocaleDateString()}
                </strong>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnPrimary}
                onClick={() =>
                  downloadFile(selectedFile.id, selectedFile.nombre)
                }
              >
                <Download size={16} /> Descargar
              </button>

              {isExcelFile(selectedFile.nombre) && (
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setEditingExcelFile(selectedFile);
                    setSelectedFile(null);
                  }}
                >
                  <Pencil size={16} /> Modificar
                </button>
              )}

              <button
                className={styles.btnDanger}
                onClick={() => handleDeleteFile(selectedFile.id)}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pantalla Editor Excel FortuneSheet */}
      {editingExcelFile && (
        <ExcelEditor
          fileId={editingExcelFile.id}
          fileName={editingExcelFile.nombre}
          onClose={() => setEditingExcelFile(null)}
          onSave={handleSaveExcel}
        />
      )}
    </>
  );
}
