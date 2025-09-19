
export type Role = "Admin" | "Manager" | "Volunteer" | "Intern" | "Donor";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  status: "Active" | "Inactive";
  password?: string;
};

export const initiatives = [
  "Educational Initiatives",
  "Healthcare Initiatives",
  "Gender Equality Initiatives",
  "Childcare Initiatives",
  "Sustainability Initiatives",
  "Relief to the Underprivileged",
  "Disaster Management",
  "Ignite Change Initiatives",
] as const;

export type Initiative = typeof initiatives[number];

export type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: "Ongoing" | "Completed" | "Planning";
  initiative: Initiative;
  initiative2?: Initiative;
  progress?: number;
  budget?: number;
};

export type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
  mobileNumber: string;
  pan: string;
  aadhaar: string;
  dob: string;
  country: string;
  state: string;
  city: string;
  pin: string;
  address: string;
  amount: number;
  currency: "INR" | "USD";
  date: string;
  project: string;
  receiptUrl?: string;
};

export type Task = {
  id: string;
  title: string;
  projectId: string;
  completed: boolean;
};

export type Upload = {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  description: string;
  initiative: Initiative;
  initiative2?: Initiative;
};
