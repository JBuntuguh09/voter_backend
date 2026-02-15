import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";
import Handlebars from "handlebars";
import { Invoice } from "../utils/Interface";

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

