import { Calendar } from "lucide-react";
export interface Order {
  Id: number;
  CreatedAt: string;
  Area: string;
  Customer: string;
  CurrentCompany: string;
  IsGenerated: boolean;
  IsReturned: boolean;
  IsSupplied: boolean;
  TotalItems: Array<{
    ProductId: number;
    Quantity: number;
  }>;
  PaymentTerms: string;
  Remarks: string;
  UserId: number;
  Email: string;
  Phone: string;
  UserName: string;
  Address: string;
  OrderTime: string;
  GenerationRemarks: string;
  ReturnRemarks: string;
  IsCompleted: boolean;
}
// Define the Product type schema based on the provided data
// constants/data.ts

export interface Product {
  Id: number;
  CompanyCode: string;
  Company: string;
  DivCode: string;
  DivName: string;
  ItemCode: string;
  Name: string;
  Packing: string;
  Tp: string;
  Mrp: number;
  Generic: string;
  createdAt: string;
  updatedAt: string;
}
// types/admin.ts
export interface Company {
  id: number;
  name: string;
  userId: string;
  description: string;
  industry: string;
  email: string;
  createdAt: string;
  portfolio?: string;
  verified: boolean;
  companySize: number;
  user?: User;
}

export interface JobDescription {
  id: number;
  companyId: number;
  title: string;
  description: string;
  skills: string[];
  questions?: any;
  experienceLevel: string;
  isActive: boolean;
  postedAt: string;
  candidates?: any;
}

export interface CompanyStats {
  totalCompanies: number;
  verifiedCompanies: number;
  unverifiedCompanies: number;
  activeJobDescriptions: number;
  avgCompanySize: number;
  companyGrowth: {
    lastMonth: number;
    lastQuarter: number;
    lastYear: number;
  };
  industryDistribution: Array<{ name: string; value: number }>;
  companySizeDistribution: Array<{ name: string; value: number }>;
}
export const Orders: Order[] = [
  {
    Id: 1,
    CreatedAt: "2024-09-01T10:00:00Z",
    Area: "North",
    Customer: "John Doe",
    CurrentCompany: "Acme Corp",
    IsGenerated: true,
    IsReturned: false,
    IsSupplied: true,
    TotalItems: [
      { ProductId: 101, Quantity: 3 },
      { ProductId: 102, Quantity: 1 },
    ],
    PaymentTerms: "Net 30",
    Remarks: "Urgent delivery required.",
    UserId: 1001,
    Email: "johndoe@example.com",
    Phone: "+1234567890",
    UserName: "john_doe",
    Address: "123 Elm Street, Springfield",
    OrderTime: "2024-09-01T10:30:00Z",
    GenerationRemarks: "Generated on time",
    ReturnRemarks: "",
    IsCompleted: false,
  },
  {
    Id: 2,
    CreatedAt: "2024-09-02T12:30:00Z",
    Area: "South",
    Customer: "Jane Smith",
    CurrentCompany: "Beta LLC",
    IsGenerated: true,
    IsReturned: false,
    IsSupplied: false,
    TotalItems: [
      { ProductId: 103, Quantity: 5 },
      { ProductId: 104, Quantity: 2 },
    ],
    PaymentTerms: "Net 60",
    Remarks: "No special instructions.",
    UserId: 1002,
    Email: "janesmith@example.com",
    Phone: "+0987654321",
    UserName: "jane_smith",
    Address: "456 Oak Avenue, Rivertown",
    OrderTime: "2024-09-02T13:00:00Z",
    GenerationRemarks: "",
    ReturnRemarks: "Returned due to stock issues",
    IsCompleted: true,
  },
  {
    Id: 3,
    CreatedAt: "2024-09-03T09:15:00Z",
    Area: "East",
    Customer: "Alice Johnson",
    CurrentCompany: "Gamma Inc",
    IsGenerated: false,
    IsReturned: true,
    IsSupplied: false,
    TotalItems: [{ ProductId: 105, Quantity: 2 }],
    PaymentTerms: "Net 15",
    Remarks: "Delivery not received.",
    UserId: 1003,
    Email: "alicejohnson@example.com",
    Phone: "+1122334455",
    UserName: "alice_johnson",
    Address: "789 Pine Road, Midtown",
    OrderTime: "2024-09-03T09:30:00Z",
    GenerationRemarks: "",
    ReturnRemarks: "Returned due to delivery issues",
    IsCompleted: false,
  },
];

export type Manager = {
  id: number;
  firstName: string;
  lastName: string;
  cnicNumber: string;
  cnicIssueDate: string;
  cnicExpiryDate: string;
  email: string;
  address: string;
  city: string;
  area: { name: string; code: string }[];
  phone1: string;
  phone2?: string;
  userType: "Field Manager";
  joiningDate: string;
  leftDate?: string;
  imei?: string;
};

export const managers: Manager[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    cnicNumber: "1234567890123",
    cnicIssueDate: "2010-01-15",
    cnicExpiryDate: "2025-01-14",
    email: "sarah.johnson@example.com",
    address: "123 Elm Street",
    city: "New York",
    area: [
      { name: "Downtown", code: "DT" },
      { name: "Uptown", code: "UP" },
    ],
    phone1: "555-1234",
    phone2: "555-5678",
    userType: "Field Manager",
    joiningDate: "2020-06-01",
  },
  {
    id: 2,
    firstName: "James",
    lastName: "Williams",
    cnicNumber: "2345678901234",
    cnicIssueDate: "2012-03-10",
    cnicExpiryDate: "2027-03-09",
    email: "james.williams@example.com",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    area: [
      { name: "Eastside", code: "ES" },
      { name: "Westside", code: "WS" },
    ],
    phone1: "555-8765",
    userType: "Field Manager",
    joiningDate: "2019-11-01",
  },
];
export type Salesperson = {
  id: number;
  firstName: string;
  lastName: string;
  cnicNumber: string;
  cnicIssueDate: string;
  cnicExpiryDate: string;
  email: string;
  address: string;
  city: string;
  area: { name: string; code: string }[];
  phone1: string;
  phone2?: string;
  userType: "Sales Manager";
  joiningDate: string;
  leftDate?: string;
  imei?: string;
};

export const salespersons: Salesperson[] = [
  {
    id: 1,
    firstName: "Michael",
    lastName: "Brown",
    cnicNumber: "3456789012345",
    cnicIssueDate: "2015-06-20",
    cnicExpiryDate: "2030-06-19",
    email: "michael.brown@example.com",
    address: "789 Pine Road",
    city: "Chicago",
    area: [
      { name: "Northside", code: "NS" },
      { name: "Southside", code: "SS" },
    ],
    phone1: "555-2345",
    phone2: "555-6789",
    userType: "Sales Manager",
    joiningDate: "2018-01-15",
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Davis",
    cnicNumber: "4567890123456",
    cnicIssueDate: "2018-08-05",
    cnicExpiryDate: "2033-08-04",
    email: "emily.davis@example.com",
    address: "321 Maple Street",
    city: "Houston",
    area: [
      { name: "Central", code: "CE" },
      { name: "Suburban", code: "SU" },
    ],
    phone1: "555-3456",
    userType: "Sales Manager",
    joiningDate: "2021-03-10",
  },
];
export type Shop = {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  fieldManagerId: number; // Foreign Key to Users (Field Manager)
  assignedMedrepId?: number; // Foreign Key to Users (Medrep)
};

export const shops: Shop[] = [
  {
    id: 1,
    name: "Tech Haven",
    address: "123 Tech Lane",
    latitude: 40.7128,
    longitude: -74.006,
    fieldManagerId: 1,
    assignedMedrepId: 3,
  },
  {
    id: 2,
    name: "Grocery World",
    address: "456 Market Street",
    latitude: 34.0522,
    longitude: -118.2437,
    fieldManagerId: 2,
  },
];

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

// export type Employee = {
//   Id: number;
//   FirstName: string;
//   LastName: string;
//   Email: string;
//   Phone1: string;
//   Phone2?: string | null; // Optional as it might be empty
//   CnicNumber: string;
//   CnicIssueDate: string; // Consider using a Date object if possible
//   CnicExpiryDate: string; // Consider using a Date object if possible
//   Address: string | null; // Since it can be "ahajajja" or null
//   Area: string | null; // Null value for area
//   City: string;
//   Imei?: string | null; // Optional field for Imei
//   JoiningDate: string; // Consider using a Date object if possible
//   LeftDate?: string | null; // Optional, can be null
//   UserType: string; // Assuming it's a string like "Medrep"
//   createdAt: string; // Consider using a Date object if possible
//   updatedAt: string; // Consider using a Date object if possible
//   password?: string; // Sensitive field, should be handled carefully
// };
export type NavItem = {
  title: string;
  href: string;
  icon: string;
  label: string;
};
export const IntervieweenavItems: NavItem[] = [
  {
    title: "Scheduled Interviews",
    href: "/interviewee",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Interview Preparation",
    href: "/interviewee/interview-preparation",
    icon: "dashboard",
    label: "InterviewPreparation",
  },
  {
    title: "Result Feedbacks",
    href: "/interviewee/Result-Feedbacks",
    icon: "profile",
    label: "Feedbacks",
  },
  // {
  //   title: "Change Password",
  //   href: "/Interviewee/change-password",
  //   icon: "dashboard",
  //   label: "Dashboard",
  // },
  // {
  //   title: "Log out",
  //   href: "/",
  //   icon: "login",
  //   label: "login",
  // },
];
export const CompanynavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/company",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Candidates",
    href: "/company/candidates",
    icon: "profile",
    label: "candidates",
  },
  // {
  //   title: "Profile",
  //   href: "/dashboard/profile",
  //   icon: "profile",
  //   label: "profile",
  // },
  // {
  //   title: "Log out",
  //   href: "/",
  //   icon: "login",
  //   label: "login",
  // },
];

export const InterviewernavItems: NavItem[] = [
  {
    title: "Scheduled Interviews",
    href: "/interviewer",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Result Feedbacks",
    href: "/interviewer/Result-Feedbacks",
    icon: "profile",
    label: "Feedbacks",
  },
  {
    title: "Interview Statistics",
    href: "/interviewer/interviewer-statistics",
    icon: "dashboard",
    label: "InterviewStatistics",
  },
  // {
  //   title: "Change Password",
  //   href: "/Interviewer/change-password",
  //   icon: "dashboard",
  //   label: "Dashboard",
  // },
  {
    title: "Availability",
    href: "/interviewer/availability",
    icon: "dashboard",
    label: "Availability",
  },
  // {
  //   title: "Log out",
  //   href: "/",
  //   icon: "login",
  //   label: "login",
  // },
];
