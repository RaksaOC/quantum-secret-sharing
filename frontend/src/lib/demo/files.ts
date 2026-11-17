/* Sample PDFs for the demo, written in the browser (small but real PDF files). */
import type { VaultFile } from "./types";

function pdfText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** A one-page PDF with a title and some lines, written by hand (Helvetica, A4). */
export function makePdf(title: string, lines: string[]): Blob {
  let y = 770;
  const body = [
    `BT /F1 20 Tf 60 ${y} Td (${pdfText(title)}) Tj ET`,
    ...lines.map((l) => `BT /F2 11 Tf 60 ${(y -= l ? 20 : 12) - 18} Td (${pdfText(l)}) Tj ET`),
  ].join("\n");
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${body.length} >>\nstream\n${body}\nendstream`,
  ];
  let out = "%PDF-1.4\n";
  const offsets: number[] = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: "application/pdf" });
}

function samplePdf(name: string, title: string, lines: string[]): VaultFile {
  const blob = makePdf(title, ["Confidential. Made-up document for the Quantum Secret Sharing demo.", "", ...lines]);
  return { name, size: blob.size, type: "application/pdf", blob };
}

export const SAMPLE_FILES = [
  {
    id: "minutes",
    label: "Board minutes",
    make: () =>
      samplePdf("board-minutes-2026-11.pdf", "Board meeting minutes, November 2026", [
        "1. Approved the 2027 budget for the new data centre.",
        "2. Agreed to keep company secrets in the quantum-secured vault.",
        "3. Opening the vault needs all three founders: Alice, Bob and Charlie.",
        "",
        "Next meeting: 15 December 2026.",
      ]),
  },
  {
    id: "contract",
    label: "Acquisition contract",
    make: () =>
      samplePdf("acquisition-contract-draft.pdf", "Acquisition agreement (draft)", [
        "Buyer: Northwind Holdings. Seller: the founders.",
        "Price: USD 4,200,000, paid in two parts.",
        "Closing date: 31 January 2027.",
        "",
        "Not to be shared before all founders sign.",
      ]),
  },
  {
    id: "salaries",
    label: "Salary report",
    make: () =>
      samplePdf("salary-report-2026.pdf", "Salary report 2026", [
        "Engineering: 14 people, average USD 2,450 / month.",
        "Operations: 6 people, average USD 1,640 / month.",
        "Finance and HR: 4 people, average USD 1,980 / month.",
        "",
        "Raises for 2027 to be agreed by the founders.",
      ]),
  },
] as const;

/** Only PDFs go in the vault. */
export function fromFile(f: File): VaultFile {
  if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) throw new Error("Please choose a PDF file.");
  return { name: f.name, size: f.size, type: "application/pdf", blob: f };
}

export function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export type FileKind = "pdf" | "csv" | "text" | "image" | "other";
export function fileKind(f: VaultFile): FileKind {
  const n = f.name.toLowerCase();
  if (f.type === "application/pdf" || n.endsWith(".pdf")) return "pdf";
  if (f.type === "text/csv" || n.endsWith(".csv")) return "csv";
  if (f.type.startsWith("image/")) return "image";
  if (f.type.startsWith("text/") || /\.(txt|md|json|log|sql)$/.test(n)) return "text";
  return "other";
}
