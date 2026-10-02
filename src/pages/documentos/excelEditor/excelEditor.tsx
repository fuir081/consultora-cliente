"use client";

import React, { useEffect, useState } from "react";
import { Workbook } from "@fortune-sheet/react";
import "@fortune-sheet/react/dist/index.css";
import { X, Save, Loader2 } from "lucide-react";
import * as XLSX from "xlsx-js-style"; //  IMPORTANTE: Usar xlsx-js-style
import styles from "../documentos.module.css";
import { fetchFileArrayBuffer } from "@/services/mega.service";

interface ExcelEditorProps {
  fileId: string;
  fileName: string;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
}

export default function ExcelEditor({
  fileId,
  fileName,
  onClose,
  onSave,
}: ExcelEditorProps) {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadExcelFromMega() {
      try {
        setLoading(true);
        const arrayBuffer = await fetchFileArrayBuffer(fileId);

        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
          cellStyles: true,
          cellFormula: true,
          cellDates: true,
          cellNF: true,
        });

        const formattedSheets = workbook.SheetNames.map((name, index) => {
          const worksheet = workbook.Sheets[name];
          const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

          const celldata: any[] = [];
          const config: any = {
            merge: {},
            columnlen: {
              0: 45, // N° (Columna A)
              1: 220, // Área / Elemento (Columna B)
              2: 110, // Frecuencia (Columna C)
              3: 220, // Método / Producto (Columna D)
              4: 90, // Estado (Columna E)
              5: 110, // Fecha / Hora (Columna F)
              6: 120, // Responsable (Columna G)
              7: 150, // Observaciones (Columna H)
            },
            rowlen: {
              0: 36, // Fila 1 (Banner Superior)
              5: 28, // Fila 6 (Cabecera Tabla)
              22: 32, // Fila 23 (Banner Cierre)
            },
          };

          // 1. Mapeo de Celdas Combinadas (!merges)
          const mergeMap = new Map<string, any>();
          if (worksheet["!merges"]) {
            worksheet["!merges"].forEach((m) => {
              const key = `${m.s.r}_${m.s.c}`;
              const mergeObj = {
                r: m.s.r,
                c: m.s.c,
                rs: m.e.r - m.s.r + 1,
                cs: m.e.c - m.s.c + 1,
              };
              config.merge[key] = mergeObj;
              mergeMap.set(key, mergeObj);
            });
          }

          // Sobrescribir anchos si la plantilla los trae explícitos
          if (worksheet["!cols"]) {
            worksheet["!cols"].forEach((col, cIdx) => {
              if (col && col.wpx) {
                config.columnlen[cIdx] = col.wpx;
              } else if (col && col.wch) {
                config.columnlen[cIdx] = Math.max(col.wch * 9, 80);
              }
            });
          }

          // 2. Procesamiento de Celdas y propagación de estilos
          for (let r = range.s.r; r <= range.e.r; ++r) {
            for (let c = range.s.c; c <= range.e.c; ++c) {
              const cellAddress = XLSX.utils.encode_cell({ r, c });
              const cell = worksheet[cellAddress];

              if (!cell && !mergeMap.has(`${r}_${c}`)) continue;

              const cellValue: any = {
                v: cell?.v ?? "",
                m: String(cell?.w || cell?.v || ""),
                ff: "Arial",
              };

              // Combinación de celdas
              const mergeKey = `${r}_${c}`;
              if (mergeMap.has(mergeKey)) {
                cellValue.mc = mergeMap.get(mergeKey);
              }

              // Estilos visuales
              if (cell && cell.s) {
                const s = cell.s;

                // Fondo
                const fillRgb =
                  s.fill?.fgColor?.rgb ||
                  s.fill?.bgColor?.rgb ||
                  s.fgColor?.rgb;
                if (fillRgb) {
                  const hex = fillRgb.replace(/^FF/i, "");
                  cellValue.bg = hex.startsWith("#") ? hex : `#${hex}`;
                }

                // Fuente
                if (s.font) {
                  if (s.font.bold) cellValue.bl = 1;
                  if (s.font.italic) cellValue.it = 1;
                  const fontRgb = s.font.color?.rgb;
                  if (fontRgb) {
                    const hex = fontRgb.replace(/^FF/i, "");
                    cellValue.fc = hex.startsWith("#") ? hex : `#${hex}`;
                  }
                }

                // Alineación
                if (s.alignment) {
                  if (s.alignment.horizontal) {
                    const hMap: Record<string, number> = {
                      left: 1,
                      center: 2,
                      right: 0,
                    };
                    cellValue.ht = hMap[s.alignment.horizontal] ?? 1;
                  }
                  if (s.alignment.vertical) {
                    const vMap: Record<string, number> = {
                      top: 2,
                      center: 0,
                      bottom: 1,
                    };
                    cellValue.vt = vMap[s.alignment.vertical] ?? 1;
                  }
                  if (s.alignment.wrapText) {
                    cellValue.tb = 1;
                  }
                }
              }

              // Regla de respaldo para Banners (Si el parser no extrajo el estilo del banner)
              if (r === 0 || r === 22) {
                cellValue.bg = cellValue.bg || "#333333";
                cellValue.fc = cellValue.fc || "#FFFFFF";
                cellValue.bl = 1;
                cellValue.ht = 2; // Centrado horizontal
                cellValue.vt = 0; // Centrado vertical
              } else if (r === 5) {
                cellValue.bg = cellValue.bg || "#444444";
                cellValue.fc = cellValue.fc || "#FFFFFF";
                cellValue.bl = 1;
              }

              celldata.push({ r, c, v: cellValue });
            }
          }

          return {
            name,
            status: index === 0 ? 1 : 0,
            order: index,
            celldata,
            config,
            row: Math.max(range.e.r + 10, 40),
            column: Math.max(range.e.c + 5, 26),
          };
        });

        setSheets(formattedSheets);
      } catch (error) {
        console.error("Error al procesar el Excel:", error);
        alert("No se pudo procesar la estructura del archivo.");
      } finally {
        setLoading(false);
      }
    }

    loadExcelFromMega();
  }, [fileId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const wb = XLSX.utils.book_new();

      sheets.forEach((sheet) => {
        const ws: XLSX.WorkSheet = {};
        let maxR = 0;
        let maxC = 0;

        // Mapas de celdas combinadas y estilos
        const merges: XLSX.Range[] = [];

        // 1. Procesar celdas desde 'data' o 'celldata' de FortuneSheet
        const cellsToProcess = sheet.celldata || [];

        // Si FortuneSheet actualizó 'sheet.data' durante la edición, extraer desde 'data'
        if (sheet.data && sheet.data.length > 0) {
          sheet.data.forEach((row: any[], r: number) => {
            (row || []).forEach((cell: any, c: number) => {
              if (cell) {
                cellsToProcess.push({ r, c, v: cell });
              }
            });
          });
        }

        cellsToProcess.forEach((item: any) => {
          const { r, c, v: cellObj } = item;
          if (!cellObj) return;

          maxR = Math.max(maxR, r);
          maxC = Math.max(maxC, c);

          const cellAddress = XLSX.utils.encode_cell({ r, c });

          // Extraer valor plano
          const cellValue =
            cellObj.v !== undefined && cellObj.v !== null ? cellObj.v : "";

          // Construcción de la celda XLSX
          const cell: XLSX.CellObject = {
            v: cellValue,
            t: typeof cellValue === "number" ? "n" : "s",
            s: {},
          };

          // Reconstrucción de Estilos en 'xlsx-js-style'

          // A. Color de Fondo (Fill)
          if (cellObj.bg) {
            const hexColor = cellObj.bg.replace("#", "");
            cell.s.fill = {
              patternType: "solid",
              fgColor: { rgb: hexColor.length === 6 ? hexColor : "FFFFFF" },
            };
          }

          // B. Estilos de Fuente (Font)
          cell.s.font = {
            name: cellObj.ff || "Arial",
            sz: cellObj.fs || 10,
            bold: cellObj.bl === 1,
            italic: cellObj.it === 1,
            color: cellObj.fc
              ? { rgb: cellObj.fc.replace("#", "") }
              : { rgb: "000000" },
          };

          // C. Alineación
          const hAlignMap: Record<number, string> = {
            0: "right",
            1: "left",
            2: "center",
          };
          const vAlignMap: Record<number, string> = {
            0: "center",
            1: "bottom",
            2: "top",
          };

          cell.s.alignment = {
            horizontal: hAlignMap[cellObj.ht] || "left",
            vertical: vAlignMap[cellObj.vt] || "center",
            wrapText: cellObj.tb === 1,
          };

          // D. Celdas combinadas (Merges)
          if (cellObj.mc && cellObj.mc.rs && cellObj.mc.cs) {
            merges.push({
              s: { r, c },
              e: {
                r: r + cellObj.mc.rs - 1,
                c: c + cellObj.mc.cs - 1,
              },
            });
          }

          ws[cellAddress] = cell;
        });

        // 2. Definir rango de la hoja
        ws["!ref"] = XLSX.utils.encode_range(
          { r: 0, c: 0 },
          { r: Math.max(maxR, 25), c: Math.max(maxC, 8) },
        );

        // 3. Aplicar celdas combinadas
        if (merges.length > 0) {
          ws["!merges"] = merges;
        }

        // 4. Mapear anchos de columnas desde la config del editor
        if (sheet.config && sheet.config.columnlen) {
          const cols: XLSX.ColInfo[] = [];
          Object.keys(sheet.config.columnlen).forEach((colIdx) => {
            const widthPx = sheet.config.columnlen[colIdx];
            cols[parseInt(colIdx, 10)] = { wpx: widthPx };
          });
          ws["!cols"] = cols;
        }

        XLSX.utils.book_append_sheet(wb, ws, sheet.name || "Hoja1");
      });

      // Generar archivo binario conservando la estructura de estilos
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const updatedFile = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      await onSave(updatedFile);
    } catch (err) {
      console.error("Error al compilar el Excel con estilos:", err);
      alert("Hubo un error al guardar el archivo Excel.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.editorOverlay}>
      <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
          <div className={styles.editorTitle}>
            <span>Editando:</span>
            <strong>{fileName}</strong>
          </div>
          <div className={styles.editorActions}>
            <button
              className={styles.btnPrimary}
              onClick={handleSave}
              disabled={loading || isSaving}
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              <span>{isSaving ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
            <button
              className={styles.btnSecondary}
              onClick={onClose}
              disabled={isSaving}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.sheetWrapper}>
          {loading ? (
            <div className={styles.emptyState}>
              <Loader2 className="animate-spin" size={32} />
              <p>Cargando datos y formato visual...</p>
            </div>
          ) : (
            <Workbook
              data={sheets}
              onChange={(newData) => setSheets(newData as any[])}
            />
          )}
        </div>
      </div>
    </div>
  );
}
