export type Role = "Admin" | "Manager" | "Volunteer" | "Intern" | "Donor";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: "Ongoing" | "Completed" | "Planning";
  progress?: number;
};

export type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
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

export type Media = {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
};
