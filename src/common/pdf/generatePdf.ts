import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import Handlebars from "handlebars";
import { Invoice } from "../utils/Interface";

import * as PDFDocument from "pdfkit";
import axios from "axios";

/* ================= DATE FORMATTER ================= */
export function formatAppointmentDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/* ================= AMOUNT FORMATTER ================= */
function formatAmount(value?: number | string | null): string {
  if (value === undefined || value === null || value === "") return "0.00";
  const num = typeof value === "string" ? Number(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

/* ================= PDF GENERATOR ================= */
export async function generateOperatingPermitPDFServer(
  invoice: Invoice
): Promise<Buffer> {

  /* ===== LOAD TEMPLATE ===== */
  const templatePath = path.join(
    process.cwd(),
    "src",
    "common",
    "pdf",
    "templates",
    "operating-permit-template.html"
  );

  const templateHtml = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(templateHtml);

  /* ===== INJECT DATA ===== */
  const html = template({
    assemblyName: invoice.assemblyName,
    businessName: invoice.operatingPermit?.businessName,
    telephone: invoice.ownerContact,
    accountNo: invoice.operatingPermit?.code,
    businessType: invoice.operatingPermit?.permitTypeName,
    category: invoice.operatingPermit?.permitTypeName,
    arrears: formatAmount(invoice.propertyRate?.arrears),
    yearFee: formatAmount(invoice.operatingPermit?.total),
    total: formatAmount(invoice.totalAmount),
    year: invoice.year,
    billDate: formatAppointmentDate(invoice.createdDatetime),
    ownerName: invoice.ownerName,
    coatOfArms: "file://" + path.join(process.cwd(), "public/images/gh.png"),
    assemblyLogo:
      "file://" + path.join(process.cwd(), "public/images/hohoe_logo.jpeg"),
  });

  /* ===== LAUNCH BROWSER ===== */
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // REQUIRED on servers
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  /* ===== GENERATE PDF ===== */
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return Buffer.from(pdf);
}



export  function  generateRankingPdf(data: any[]): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      /* ================= HEADER ================= */
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("Election Results Report", { align: "center" });

      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Generated on: ${new Date().toLocaleString()}`, {
          align: "center",
        });

      doc.moveDown(2);

      /* ================= LOOP POSITIONS ================= */
      for (const position of data) {
        doc
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(position.position, { underline: true });

        doc.moveDown(0.5);

        // Table Header
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("Rank", 50)
          .text("Photo", 100)
          .text("Candidate", 160)
          .text("Votes", 350)
          .text("Status", 420);

        doc.moveDown(0.5);

        let y = doc.y;

        const maxVotes = Math.max(
          ...position.candidates.map((c: any) => c.votes),
        );

        for (const candidate of position.candidates) {
          const isWinner = candidate.votes === maxVotes;

          // Rank
          doc.font("Helvetica").fontSize(10).text(candidate.rank, 50, y);

          /* ========= IMAGE ========= */
          try {
            if (candidate.imageBase64) {
              const base64Data = candidate.imageBase64.split(",").pop();
              const imgBuffer = Buffer.from(base64Data, "base64");

              doc.image(imgBuffer, 100, y - 5, {
                width: 30,
                height: 30,
              });
            } else if (candidate.imageUrl) {
              const response = await axios.get(candidate.imageUrl, {
                responseType: "arraybuffer",
              });

              doc.image(Buffer.from(response.data), 100, y - 5, {
                width: 30,
                height: 30,
              });
            }
          } catch {
            // fallback circle
            doc.circle(115, y + 5, 10).stroke();
          }

          /* ========= NAME ========= */
          doc
            .font("Helvetica")
            .text(candidate.name, 160, y, { width: 170 });

          /* ========= VOTES ========= */
          doc.text(candidate.votes.toString(), 350, y);

          /* ========= STATUS ========= */
          if (isWinner) {
            doc
              .fillColor("green")
              .font("Helvetica-Bold")
              .text("🏆 Winner", 420, y)
              .fillColor("black");
          }

          y += 40;

          // Page break safety
          if (y > 750) {
            doc.addPage();
            y = 50;
          }
        }

        doc.moveDown(2);

        /* ========= DRAW NOTICE ========= */
        const winners = position.candidates.filter(
          (c: any) => c.votes === maxVotes,
        );

        if (winners.length > 1) {
          doc
            .fillColor("orange")
            .font("Helvetica-Bold")
            .text(
              "⚖️ Draw detected: Multiple candidates have highest votes",
            )
            .fillColor("black");

          doc.moveDown(1);
        }

        doc.addPage(); // each position on new page
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
