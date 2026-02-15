import { randomInt } from "crypto";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const ALL = LETTERS + NUMBERS;

export interface ErrorResponse {
  status: boolean;
  code: number;
  message: string;
}


export interface AuthResponse {
  status: boolean;
  code: number;
  message: string;
  data: AuthData;
}

export interface AuthData {
  access_token: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  level: string;
  password: string;
  status: string;
  person: Person;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string; // ISO date string
  updatedDatetime: string;
}

export interface Person {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  assembly: Assembly | null;
  region: Region | null;
  image: Image | null;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Assembly {
  id: number;
  name: string;
  type: string;
  description: string;
  regionId: number;
  regionName: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Region {
  id: number;
  name: string;
  description: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Image {
  id: number;
  url: string;
  base64: string;
  publicId: string;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface SummaryModules{
  status: boolean;
  code: number;
  message: string;
  data:{
    all: number | null,
    active:number | null,
    expiringSoon:number | null,
    expired:number | null,
  }
  
}


export interface PermitTypeResponse {
  status: boolean;
  code: number;
  message: string;
  data: PermitDataWrapper | null ;
}

export interface PermitDataWrapper {
  data: PermitType[];
  total: number;
  page: number;
  limit: number;
}

export interface PermitType {
  id: number;
  name: string;
  description: string;
  fee: string;
  durationInMonths: number;
  assembly: Assembly | null;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface OperatingPermitSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: OperatingPermitData ;
}

export interface OperatingPermitData {
  all: number;
  active: number;
  expiringSoon: number;
  expired: number;
  activeData: OperatingPermit[] | [];
}



export enum ColorText {
  Active = "#10b981",       // Green
  Expired = "#ef4444",      // Red
  ExpiringSoon = "#f59e0b", // Amber
  PendingReview = "#3b82f6" // Blue
}

export enum ColorBg {
  Active = "#ecfdf3",       // Light green background
  Expired = "#fee2e2",      // Light red background
  ExpiringSoon = "#fef3c7", // Light amber background
  PendingReview = "#dbeafe" // Light blue background
}


export interface OperatingPermitResponse {
  status: boolean;
  code: number;
  message: string;
  data: OperatingPermitPaginatedData;
}

export interface OperatingPermitPaginatedData {
  data: OperatingPermit[] | [];
  total: number;
  limit: number;
  page: number;
}

export interface OperatingPermit {
  id: number;
  code: string;
  businessName: string;
  registrationNumber: string;
  tin: string | null;
  yearEstablished: string | null;
  businessDescription: string | null;
  expiryDate: Date | null;

  contactPersonName: string | null;
  contactPersonEmail: string | null;
  contactPersonPhone: string | null;

  website: string | null;
  exactLocation: string | null;
  longitude: string | null;
  latitude: string | null;

  permitTypeName: string | null;
  city: string | null;
  street: string | null;
  fee: number | null;

  permitType: PermitType  | undefined;
  assembly: Assembly;

  documents?: DocumentFile[] | [];

  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: Date;
  updatedDatetime: Date;

  zoneName: string | null;
  zoneId: number | null;

  arrears: string;
  bopFee: string;
  brFee: string;
  tsFee: string;
  slFee: string;
  total: string;
}

export interface DocumentFile {
  id: number;
  documentName: string;
  url: string;
  base64: string | null;
  publicId: string;
  fileType: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}



// export interface PermitType {
//   id: number;
//   name: string;
//   description: string;
//   fee: string;
//   durationInMonths: number;
//   status: string;
//   createdBy: string;
//   updatedBy: string;
//   createdDatetime: string;
//   updatedDatetime: string;
// }

export interface Assembly {
  id: number;
  name: string;
  type: string;
  description: string;
  regionId: number;
  regionName: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Document {
  id: number;
  documentName: string;
  url: string;
  base64: string | null;
  publicId: string;
  fileType: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}


// export interface OtherRevenueSummaryResponse {
//   status: boolean;
//   code: number;
//   message: string;
//   data: OtherRevenueSummaryData;
// }

export interface OtherRevenueSummaryData {
  activeTotal: number;
  totalAmount: number;
  pending: number;
  totalQuarterAmount: number;
  totalYearAmount: number;
  currentQuarter: number;
  currentYear: number;
  activeData: OtherRevenueItem[];
}

export interface OtherRevenueItem {
  id: number;
  code: string;
  name: string;
  description: string;
  amount: string; // backend returns string for decimal
  assembly: Assembly | null;
  category: Category | null;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: Date;
  updatedDatetime: Date;
}

export interface CategoryResponse {
  status: boolean;
  code: number;
  message: string;
  data: CategoryPaginatedData;
}

export interface CategoryPaginatedData {
  data: Category[] | [];
  total: number;
  limit: number;
  page: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  type?: string|null;
  fee: string;
  assembly: Assembly;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Zone {
  id: number;
  name: string;
  description: string;
  assembly: Assembly;
  electoralArea: ElectoralAreaItem;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}




export interface PropertyRateSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: PropertyRateSummaryData;
}

export interface PropertyRateSummaryData {
  totalProperties: number;
  totalValue: number;
  pendingReview: number;
  totalDue: number;
  revenueGenerated: number;
  paid: number;
  unpaid: number;
  currentYear: number;
  activeData: PropertyRate[];
  residential: number;
  commercial: number;
  others: number;
}

// export interface PropertyRateItem {
//   id: number;
//   code: string;
//   propertyAddress: string;
//   estimatedValue: string;
//   rateImposed: string;
//   rateCharged: string;
//   digitalAddress: string | null;
//   nearestLandmark: string | null;
//   longitude: string | null;
//   latitude: string | null;
//   ownerName: string | null;
//   ownerContact: string | null;
//   propertyType: PropertyType | null;
//   status: string;
//   createdBy: string | null;
//   updatedBy: string | null;
//   createdDatetime: string;
//   updatedDatetime: string;
// }

export interface PropertyType {
  id: number;
  name: string;
  rate: string;
  description: string;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface PropertyTypeResponse {
  status: boolean;
  code: number;
  message: string;
  data: PropertyDataWrapper | null ;
}

export interface PropertyDataWrapper {
  data: PropertyType[];
  total: number;
  page: number;
  limit: number;

}

export interface PropertyRateBody {
  id: number;
  propertyAddress: string;
  estimatedValue: number;
  rateImposed: number;
  rateCharged: number;
  latitude: string;
  longitude: string;
  ownerName: string;
  ownerContact: string;
  nearestLandmark: string;
  regionId: number;
  propertyTypeId: number;
  assemblyId: number;
  status: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface OtherRevenueSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    totalCollected: number;
    totalExpected: number;
    outstanding: number;

    totalYearCollected: number;
    totalQuarterCollected: number;
    currentYear: number;
    currentQuarter: number;

    activeTotal: number;
    pendingTotal: number;

    data: OtherRevenueItem[];
  };
}

export interface ApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResultFinance<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPaidAmount: number | 0,
  totalPendingAmount: number | 0,
  totalDueAmount: number | 0,
}

export interface PropertyRateOld {
  id: number;
  code: string;
  propertyAddress: string | null;
  estimatedValue: string | null;
  rateImposed: string | null;
  rateCharged: string | null;
  digitalAddress: string | null;
  nearestLandmark: string | null;
  longitude: string | null;
  latitude: string | null;
  ownerName: string | null;
  ownerContact: string | null;
  propertyType: PropertyType | null;
  assembly: Assembly | null;
  documents: Document[] | [];
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;

  ownerAddress?: string;
  upn: string;
  subUpn?: string;
  zone?: string;
  class?: string;
  category?: string;
  expiryDate: Date; // ISO string
 
}

export interface PropertyRate {
  id: number;
  code: string;

  propertyAddress: string;
  estimatedValue: string;
  rateImposed: string;
  rateCharged: string;
  arrears: string;
  payments: string;
  currentFeeCharged: string;

  digitalAddress: string | null;
  nearestLandmark: string | null;
  longitude: string | null;
  latitude: string | null;

  ownerName: string;
  ownerContact: string;
  ownerAddress: string;
  ownerGPS: string | null;
  ownerTIN: string | null;
  ownerEmail: string | null;
  ownerGhCard: string | null;

  community: string | null;
  communityId: number | null;
  electoralArea: string | null;
  electoralAreaId: number | null;

  propertyTypeName: string;
  zone: string;
  zoneId: number | null;

  class: string;
  classId: number | null;

  category: string;
  categoryId: number | null;

  streetName: string | null;
  houseNumber: string | null;

  upn: string;
  subUpn: string;

  codeAssembly: string | null;
  excluded: string; // "0" | "1"

  ghPost: string | null;
  localityCode: string;

  expiryDate: Date; // ISO date
  status: string;

  createdBy: string;
  updatedBy: string | null;

  createdDatetime: Date; // ISO datetime
  updatedDatetime: Date; // ISO datetime
   propertyType: PropertyType | null;
  assembly: Assembly | null;
  documents: Document[] | [];
}


export interface InvoiceNot {
  id: number;
  code: string;
  propertyAddress: string;
  estimatedValue: string;
  rateImposed: string;
  rateCharged: string;

  digitalAddress: string | null;
  nearestLandmark: string | null;
  longitude: string | null;
  latitude: string | null;

  ownerName: string;
  ownerContact: string;
  ownerAddress: string;

  propertyTypeName: string | null;

  zone: string;
  zoneId: number | null;

  class: string | null;
  classId: number | null;

  category: string;
  categoryId: number | null;

  ownerEmail: string | null;
  ownerGhCard: string | null;

  streetName: string | null;
  houseNumber: string | null;

  upn: string;
  subUpn: string;

  codeAssembly: string | null;

  excluded: string; // consider boolean if API allows
  ghPost: string | null;
  localityCode: string;

  expiryDate: string; // ISO date string
  status: string;

  createdBy: string;
  updatedBy: string | null;

  createdDatetime: string; // ISO date string
  updatedDatetime: string;
}


export interface Invoice{
  id: number;
  type: string;
  code: string | null;
  activity: string;
  description: string;
  year :string | null
  operatingPermit: OperatingPermit | null;
  otherRevenue: OtherRevenueItem | null;
  propertyRate: PropertyRate | null;
  person: Person | null;
  totalAmount: string;
  balance: string;
  amountPaid: string;
  ownerName: string;
  ownerContact: string;
  assemblyId: number;
  assemblyName: string;
  regionId: number;
  regionName: string;
  transactionStatus: string;
  dueDate: string; // ISO date string
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string; // ISO date string
  updatedDatetime: string; // ISO date string

  
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta;
  data: T[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}



export interface RoleItem {
  id: number;
  name: string;
  description: string | null;
  assembly: Assembly;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}


export interface UserResponse {
  id: number;
  username: string;
  email: string;
  password: string;
  level: string;
  status: string;
  departmentId: number;
  departmentName: string;
  person: Person;
  role: Role ;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}




export interface Role {
  id: number;
  name: string;
  description: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}


export interface Approval {
  id: number;
  operatingPermit: OperatingPermit | null;
  otherRevenue: OtherRevenueItem | null;
  propertyRate: PropertyRate | null;
  person: any | null;
  approvalDate: string;
  type: string;
  approvalStatus: string,
  signaetureId: number | null;
  signatureUrl: string | null;
  assemblyId: number;
  assemblyName: string | null;
  regionId: number | null;
  regionName: string | null;
  status: string;
  comment: string;
  applicant:Person | null;
  approver: Person | null;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}




export interface CommunityItem {
  id: number;
  name: string;
  code: string;
  description: string;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface ApiListResponse<T> {
  message: string;
  total: number;
  totalPages?: number;
  data: T[];
}

export interface Community {
  id: number;
  name: string;
  description: string;
  code: string;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}


export interface ElectoralAreaItem {
  id: number;
  name: string | null;
  description: string;
  community: Community;
  assembly: Assembly;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface ElectoralAreaData {
  total: number;
  data: ElectoralAreaItem[];
}

export interface ElectoralAreaResponse {
  status: boolean;
  code: number;
  message: string;
  data: ElectoralAreaData;
}

export interface PaginatedPropertyClassResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: PropertyClass[];
}

export interface PropertyClass {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string; // ISO date string
  updatedDatetime: string; // ISO date string
}



export interface PersonItem {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface UserItem {
  id: number;
  username: string;
  email: string;
  level: string;
  status: string;
  departmentId: number | null;
  departmentName: string | null;
  person: PersonItem;
  role: Role;
  createdBy: string | null;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}

export interface UserListResponse {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: UserItem[];
}


export interface OperatingPermitExportDto {
  Zone: string
  "Permit Code": string
  "Business Name": string
  "Registration Number": string
  "Permit Type": string
  "Exact Location": string
  Street: string
  City: string
  Longitude: string
  Latitude: string
  "Contact Person": string
  "Contact Phone": string
  "Contact Email": string
  TIN: string
  Assembly: string
  Region: string
  "BOP Fee": string
  "BR Fee": string
  "TS Fee": string
  "SL Fee": string
  Arrears: string
  "Total Due": string
  Status: string
  "ENTERED BY": string
  "ENTRY DATE": string
}


export const mapOperatingPermitToExport = (
  rawRows: any[]
): OperatingPermitExportDto[] =>
  rawRows.map((row) => ({
    Zone: row.zoneName?.toString() || "",
    "Permit Code": row.code?.toString() || "",
    "Business Name": row.businessName?.toString() || "",
    "Registration Number": row.registrationNumber?.toString() || "",
    "Permit Type":
      row.permitTypeName ||
      row.permitType?.name ||
      "",
    "Exact Location": row.exactLocation?.toString() || "",
    Street: row.street?.toString() || "",
    City: row.city?.toString() || "",
    Longitude: row.longitude?.toString() || "",
    Latitude: row.latitude?.toString() || "",
    "Contact Person": row.contactPersonName?.toString() || "",
    "Contact Phone": row.contactPersonPhone?.toString() || "",
    "Contact Email": row.contactPersonEmail?.toString() || "",
    TIN: row.tin?.toString() || "",
    Assembly: row.assembly?.name || "",
    Region: row.assembly?.regionName || "",
    "BOP Fee": row.bopFee?.toString() || "0.00",
    "BR Fee": row.brFee?.toString() || "0.00",
    "TS Fee": row.tsFee?.toString() || "0.00",
    "SL Fee": row.slFee?.toString() || "0.00",
    Arrears: row.arrears?.toString() || "0.00",
    "Total Due": row.total?.toString() || "0.00",
    Status: row.status || "",
    "ENTERED BY": row.createdBy || "SYSTEM",
    "ENTRY DATE": row.createdDatetime
      ? new Date(row.createdDatetime).toISOString()
      : new Date().toISOString(),
  }))


  export interface DepartmentApiResponse<T> {
  status: boolean;
  code: number;
  message: string;
  data: {
    data: T[];
    meta: Meta;
  };
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  paginated: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  assembly: Assembly;
  status: "Active" | "Inactive";
  createdBy: string;
  updatedBy: string | null;
  createdDatetime: string;
  updatedDatetime: string;
}





export function generateSixCharPassword(): string {
  let password = [
    LETTERS[randomInt(0, LETTERS.length)],
    NUMBERS[randomInt(0, NUMBERS.length)],
  ];

  for (let i = 2; i < 6; i++) {
    password.push(ALL[randomInt(0, ALL.length)]);
  }

  // Shuffle so letter/number aren't always first
  return password
    .sort(() => randomInt(0, 2) - 0.5)
    .join("");
}
