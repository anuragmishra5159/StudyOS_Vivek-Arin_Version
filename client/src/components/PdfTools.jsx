import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Upload,
  Loader2,
  FileText,
  Image as LucideImage,
  FileType2,
  FileImage,
  Plus,
  Check,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   Helper Utilities
   ═══════════════════════════════════════════════ */

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getImageDimensions = (dataUrl) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 800, height: 600 });
    img.src = dataUrl;
  });

/**
 * Normalize any image file to a JPEG or PNG data URL via canvas.
 * This ensures jsPDF compatibility for all formats (WebP, BMP, AVIF, etc.).
 */
const normalizeImageToDataUrl = (file, outputFormat = "JPEG") =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        // White background for JPEG (no transparency)
        if (outputFormat === "JPEG") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const mime = outputFormat === "PNG" ? "image/png" : "image/jpeg";
        const quality = outputFormat === "JPEG" ? 0.95 : undefined;
        resolve({
          dataUrl: canvas.toDataURL(mime, quality),
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: outputFormat,
        });
      };
      img.onerror = () =>
        reject(new Error("Failed to load image: " + file.name));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

/* ═══════════════════════════════════════════════
   Tool 1 — Text → PDF
   ═══════════════════════════════════════════════ */

const TextToPdf = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setDone(false);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const usableW = pageW - margin * 2;
      let y = margin;

      // ── Title ──
      if (title.trim()) {
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        const titleLines = doc.splitTextToSize(title, usableW);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 10 + 4;
        doc.setDrawColor(200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageW - margin, y);
        y += 8;
      }

      // ── Body Text ──
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30);
      const lineH = fontSize * 0.45 + 1;
      const lines = doc.splitTextToSize(text, usableW);

      for (const line of lines) {
        if (y + lineH > pageH - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineH;
      }

      // ── Page Numbers ──
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${total}`, pageW / 2, pageH - 10, {
          align: "center",
        });
        doc.setTextColor(30);
      }

      doc.save(`${title.trim() || "document"}.pdf`);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("Text→PDF error:", err);
      alert("Failed to create PDF. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
          Document Title{" "}
          <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Document"
          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Text Content */}
      <div>
        <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
          Text Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={10}
          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all resize-none custom-scrollbar font-mono"
        />
        <p className="text-[10px] text-text-muted mt-1 text-right">
          {text.length.toLocaleString()} characters
        </p>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
          Font Size:{" "}
          <span className="text-primary font-bold">{fontSize}px</span>
        </label>
        <input
          type="range"
          min={8}
          max={24}
          step={1}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-primary h-1.5"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
          <span>8px</span>
          <span>24px</span>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={loading || !text.trim()}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Generating…
          </>
        ) : done ? (
          <>
            <Check size={16} /> Downloaded!
          </>
        ) : (
          <>
            <Download size={16} /> Convert & Download PDF
          </>
        )}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Tool 2 — Image(s) → PDF
   ═══════════════════════════════════════════════ */

const ImageToPdf = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const fileRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith("image/"));
    const newItems = valid.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setImages((prev) => [...prev, ...newItems]);
    setDone(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, []);

  const handleConvert = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setDone(false);
    try {
      const { jsPDF } = await import("jspdf");
      const orient = orientation === "portrait" ? "p" : "l";
      const doc = new jsPDF({ orientation: orient, unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 10;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();

        // Normalize through canvas — handles WebP, BMP, AVIF, and any format
        const usePng = images[i].file.type === "image/png";
        const fmt = usePng ? "PNG" : "JPEG";
        const normalized = await normalizeImageToDataUrl(images[i].file, fmt);

        // Scale image to fit within page margins, preserving aspect ratio
        const imgRatio = normalized.width / normalized.height;
        const pageRatio = maxW / maxH;
        let w, h;

        if (imgRatio > pageRatio) {
          w = maxW;
          h = maxW / imgRatio;
        } else {
          h = maxH;
          w = maxH * imgRatio;
        }

        // Center on page
        const x = margin + (maxW - w) / 2;
        const y = margin + (maxH - h) / 2;

        doc.addImage(normalized.dataUrl, fmt, x, y, w, h);
      }

      doc.save("images.pdf");
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("Image→PDF error:", err);
      alert("Failed to generate PDF: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Orientation */}
      <div>
        <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
          Page Orientation
        </label>
        <div className="flex gap-2">
          {["portrait", "landscape"].map((o) => (
            <button
              key={o}
              onClick={() => setOrientation(o)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                orientation === o
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-background text-text-muted border border-border hover:bg-surface"
              }`}
            >
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <Upload size={24} className="mx-auto text-text-muted mb-2" />
        <p className="text-sm text-text-secondary font-medium">
          Click to add images
        </p>
        <p className="text-[10px] text-text-muted mt-1">
          JPG, PNG, WebP — multiple files supported
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <Plus size={12} /> Add More
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-lg overflow-hidden aspect-square bg-background border border-border"
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white px-1 py-0.5 text-center truncate">
                  {idx + 1}. {img.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert */}
      <button
        onClick={handleConvert}
        disabled={loading || images.length === 0}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Converting…
          </>
        ) : done ? (
          <>
            <Check size={16} /> Downloaded!
          </>
        ) : (
          <>
            <Download size={16} /> Convert & Download PDF
          </>
        )}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Tool 3 — DOCX → PDF
   ═══════════════════════════════════════════════ */

const DocToPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState("");
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setDone(false);
    setPreview("");
    setParsing(true);

    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await f.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setPreview(result.value);
    } catch (err) {
      console.error("Doc parse error:", err);
      setPreview(
        '<p style="color:red;">Could not preview this document. Try converting anyway.</p>',
      );
    }
    setParsing(false);
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setDone(false);

    let container = null;
    try {
      const mammoth = await import("mammoth");
      const { jsPDF } = await import("jspdf");
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      // Create a VISIBLE container (html2canvas cannot capture off-screen elements)
      container = document.createElement("div");
      container.id = "doc-pdf-render-container";
      container.style.cssText = `
        position: fixed; top: 0; left: 0; z-index: 99999;
        width: 794px; background: white;
        font-family: 'Times New Roman', Georgia, serif;
        font-size: 14px; line-height: 1.7; color: #1a1a1a;
        padding: 60px 50px;
        overflow: visible;
        pointer-events: none;
        opacity: 0;
      `;
      container.innerHTML = `
        <style>
          #doc-pdf-render-container h1 { font-size: 26px; font-weight: bold; margin: 20px 0 10px; color: #111; }
          #doc-pdf-render-container h2 { font-size: 22px; font-weight: bold; margin: 18px 0 8px; color: #222; }
          #doc-pdf-render-container h3 { font-size: 18px; font-weight: bold; margin: 14px 0 6px; color: #333; }
          #doc-pdf-render-container p  { margin: 6px 0; }
          #doc-pdf-render-container ul, #doc-pdf-render-container ol { margin: 8px 0; padding-left: 28px; }
          #doc-pdf-render-container li { margin: 3px 0; }
          #doc-pdf-render-container table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          #doc-pdf-render-container td, #doc-pdf-render-container th { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
          #doc-pdf-render-container th { background: #f5f5f5; font-weight: bold; }
          #doc-pdf-render-container strong, #doc-pdf-render-container b { font-weight: bold; }
          #doc-pdf-render-container em, #doc-pdf-render-container i { font-style: italic; }
          #doc-pdf-render-container blockquote { border-left: 3px solid #ddd; padding-left: 16px; color: #555; margin: 10px 0; }
          #doc-pdf-render-container a { color: #2563eb; text-decoration: underline; }
          #doc-pdf-render-container img { max-width: 100%; height: auto; }
        </style>
        ${result.value}
      `;
      document.body.appendChild(container);

      // Wait for fonts / images to settle
      await new Promise((r) => setTimeout(r, 500));

      // Force layout recalculation
      void container.offsetHeight;

      // Capture entire container with html2canvas
      // The original element has opacity:0 so user doesn't see it flash.
      // We use onclone to set opacity:1 on the CLONE so html2canvas renders content.
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: container.scrollHeight,
        onclone: (_clonedDoc, clonedEl) => {
          clonedEl.style.opacity = "1";
          clonedEl.style.position = "static";
          clonedEl.style.transform = "none";
        },
      });

      // Remove container immediately after capture
      if (document.body.contains(container))
        document.body.removeChild(container);
      container = null;

      // A4 dimensions in mm
      const a4W = 210;
      const a4H = 297;
      const marginMm = 10;
      const usableW = a4W - marginMm * 2;
      const usableH = a4H - marginMm * 2;

      // Calculate how many pages we need
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pxPerMm = imgWidth / usableW; // pixels per mm
      const pageHeightPx = usableH * pxPerMm; // height of one page in pixels
      const totalPages = Math.ceil(imgHeight / pageHeightPx);

      const doc = new jsPDF({ unit: "mm", format: "a4" });

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) doc.addPage();

        // Create a slice of the full canvas for this page
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = imgWidth;
        const remainingPx = imgHeight - page * pageHeightPx;
        const sliceHeight = Math.min(pageHeightPx, remainingPx);
        sliceCanvas.height = sliceHeight;

        const sliceCtx = sliceCanvas.getContext("2d");
        sliceCtx.fillStyle = "#ffffff";
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas,
          0,
          page * pageHeightPx, // source x, y
          imgWidth,
          sliceHeight, // source w, h
          0,
          0, // dest x, y
          imgWidth,
          sliceHeight, // dest w, h
        );

        const sliceDataUrl = sliceCanvas.toDataURL("image/jpeg", 0.95);
        const sliceHMm = sliceHeight / pxPerMm;
        doc.addImage(
          sliceDataUrl,
          "JPEG",
          marginMm,
          marginMm,
          usableW,
          sliceHMm,
        );
      }

      // Add page numbers
      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${total}`, a4W / 2, a4H - 8, {
          align: "center",
        });
      }

      doc.save(`${file.name.replace(/\.[^.]+$/, "")}.pdf`);

      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error("Doc→PDF error:", err);
      if (container && document.body.contains(container))
        document.body.removeChild(container);
      alert("Failed to convert document: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <Upload size={24} className="mx-auto text-text-muted mb-2" />
        <p className="text-sm text-text-secondary font-medium">
          {file ? file.name : "Click to select a document"}
        </p>
        <p className="text-[10px] text-text-muted mt-1">
          .docx files supported
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Preview */}
      {parsing && (
        <div className="flex items-center justify-center gap-2 py-3">
          <Loader2 size={16} className="animate-spin text-primary" />
          <span className="text-xs text-text-secondary">Parsing document…</span>
        </div>
      )}

      {preview && !parsing && (
        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Document Preview
          </label>
          <div className="bg-white rounded-xl border border-border p-4 max-h-52 overflow-y-auto custom-scrollbar">
            <div
              className="text-sm text-slate-800 leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:my-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-1 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_strong]:font-bold [&_em]:italic [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-300 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-slate-100 [&_th]:font-semibold"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      )}

      {/* Convert */}
      <button
        onClick={handleConvert}
        disabled={loading || !file}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Converting…
          </>
        ) : done ? (
          <>
            <Check size={16} /> Downloaded!
          </>
        ) : (
          <>
            <Download size={16} /> Convert & Download PDF
          </>
        )}
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Tool 4 — PDF → JPG / PNG
   ═══════════════════════════════════════════════ */

const PdfToImage = () => {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // { dataUrl, pageNum }
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png");
  const [scale, setScale] = useState(2);
  const [progress, setProgress] = useState("");
  const fileRef = useRef(null);

  // Process the PDF whenever file, format, or scale changes
  const processPdf = useCallback(
    async (f) => {
      if (!f) return;
      setLoading(true);
      setPages([]);
      setProgress("Loading PDF library…");

      try {
        const pdfjsLib = await import("pdfjs-dist");

        // Set up worker via CDN (Vite-compatible)
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        setProgress("Reading PDF…");
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        const rendered = [];

        for (let i = 1; i <= totalPages; i++) {
          setProgress(`Rendering page ${i} of ${totalPages}…`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");

          await page.render({ canvasContext: ctx, viewport }).promise;

          const mime = format === "jpeg" ? "image/jpeg" : "image/png";
          const quality = format === "jpeg" ? 0.92 : undefined;
          const dataUrl = canvas.toDataURL(mime, quality);

          rendered.push({ dataUrl, pageNum: i });
        }

        setPages(rendered);
        setProgress("");
      } catch (err) {
        console.error("PDF→Image error:", err);
        alert("Failed to process PDF. Please ensure it's a valid PDF file.");
        setProgress("");
      }
      setLoading(false);
    },
    [format, scale],
  );

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    processPdf(f);
  };

  // Re-process when format/scale changes (only if file is already selected)
  useEffect(() => {
    if (file) processPdf(file);
  }, [format, scale]);

  const downloadPage = (page) => {
    const ext = format === "jpeg" ? "jpg" : "png";
    const link = document.createElement("a");
    link.href = page.dataUrl;
    link.download = `${(file?.name || "page").replace(".pdf", "")}_page${page.pageNum}.${ext}`;
    link.click();
  };

  const downloadAll = () => {
    pages.forEach((page, i) => {
      setTimeout(() => downloadPage(page), i * 400);
    });
  };

  return (
    <div className="space-y-4">
      {/* Format & Quality selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Output Format
          </label>
          <div className="flex gap-2">
            {["png", "jpeg"].map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  format === f
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-background text-text-muted border border-border hover:bg-surface"
                }`}
              >
                {f === "jpeg" ? "JPG" : "PNG"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
            Resolution
          </label>
          <div className="flex gap-1.5">
            {[
              { label: "1×", val: 1 },
              { label: "2×", val: 2 },
              { label: "3×", val: 3 },
            ].map((q) => (
              <button
                key={q.val}
                onClick={() => setScale(q.val)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  scale === q.val
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-background text-text-muted border border-border hover:bg-surface"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => !loading && fileRef.current?.click()}
        className={`border-2 border-dashed border-border rounded-2xl p-6 text-center transition-all ${
          loading
            ? "cursor-wait opacity-60"
            : "cursor-pointer hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        {loading ? (
          <>
            <Loader2
              size={24}
              className="mx-auto text-primary mb-2 animate-spin"
            />
            <p className="text-sm text-text-secondary font-medium">
              {progress}
            </p>
          </>
        ) : (
          <>
            <Upload size={24} className="mx-auto text-text-muted mb-2" />
            <p className="text-sm text-text-secondary font-medium">
              {file ? file.name : "Click to select a PDF"}
            </p>
            <p className="text-[10px] text-text-muted mt-1">.pdf files only</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Page Grid */}
      {pages.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">
              {pages.length} page{pages.length !== 1 ? "s" : ""} rendered
            </span>
            {pages.length > 1 && (
              <button
                onClick={downloadAll}
                className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Download size={12} /> Download All
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {pages.map((page) => (
              <button
                key={page.pageNum}
                onClick={() => downloadPage(page)}
                className="relative group rounded-lg overflow-hidden bg-white border border-border hover:border-primary/40 transition-all"
                title={`Download page ${page.pageNum}`}
              >
                <img
                  src={page.dataUrl}
                  alt={`Page ${page.pageNum}`}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <Download
                    size={18}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] text-white px-1 py-0.5 text-center">
                  Page {page.pageNum}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Exported Tool Config & Modal Wrapper
   ═══════════════════════════════════════════════ */

export const pdfTools = [
  {
    id: "text-pdf",
    title: "Text to PDF",
    shortLabel: "Text→PDF",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    Component: TextToPdf,
  },
  {
    id: "img-pdf",
    title: "Image to PDF",
    shortLabel: "Img→PDF",
    icon: LucideImage,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    Component: ImageToPdf,
  },
  {
    id: "doc-pdf",
    title: "Doc to PDF",
    shortLabel: "Doc→PDF",
    icon: FileType2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    Component: DocToPdf,
  },
  {
    id: "pdf-img",
    title: "PDF to Image",
    shortLabel: "PDF→Img",
    icon: FileImage,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    Component: PdfToImage,
  },
];

const toolMap = Object.fromEntries(pdfTools.map((t) => [t.id, t]));

const PdfToolModal = ({ tool, onClose }) => {
  // Close on Escape
  useEffect(() => {
    if (!tool) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [tool, onClose]);

  const config = tool ? toolMap[tool] : null;

  return createPortal(
    <AnimatePresence>
      {tool && config && (
        <motion.div
          key="pdf-tool-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            key="pdf-tool-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.bg} ${config.color}`}
                >
                  <config.icon size={18} />
                </div>
                <h2 className="text-base font-bold text-text-main">
                  {config.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-main transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <config.Component />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default PdfToolModal;
