import type { User, Role, Project, Donation, Task, Upload, Initiative } from './types';
import { initiatives } from './types';

export const mockUsers: Record<Role, User> = {
  Admin: {} as User,
  Manager: {} as User,
  Volunteer: {} as User,
  Intern: {} as User,
  Donor: {} as User,
};

export const allMockUsers: User[] = [];

export const mockProjects: Project[] = [];

export const mockDonations: Donation[] = [];

export const mockTasks: Task[] = [];

export const mockUploads: Upload[] = [];

export const mockPhotos: Upload[] = [];

const rawMonthlyTrend = [
    { month: 'Jan', INR: 40000, USD: 500 },
    { month: 'Feb', INR: 30000, USD: 350 },
    { month: 'Mar', INR: 50000, USD: 600 },
    { month: 'Apr', INR: 45000, USD: 550 },
    { month: 'May', INR: 60000, USD: 700 },
    { month: 'Jun', INR: 55000, USD: 650 },
    { month: 'Jul', INR: 70000, USD: 800 },
    { month: 'Aug', INR: 65000, USD: 750 },
    { month: 'Sep', INR: 75000, USD: 850 },
    { month: 'Oct', INR: 80000, USD: 900 },
    { month: 'Nov', INR: 90000, USD: 1000 },
    { month: 'Dec', INR: 85000, USD: 950 },
];

export const donationMonthlyTrend = rawMonthlyTrend.map(d => ({
  ...d,
  Total: d.INR + d.USD * 80
}));

const rawWeeklyTrend = [
  { week: "W1", INR: 10000, USD: 125 },
  { week: "W2", INR: 12000, USD: 150 },
  { week: "W3", INR: 8000, USD: 100 },
  { week: "W4", INR: 15000, USD: 180 },
];

export const donationWeeklyTrend = rawWeeklyTrend.map(d => ({
  ...d,
  Total: d.INR + d.USD * 80
}));

const rawDailyTrend = [
  { day: "Mon", INR: 2000, USD: 25 },
  { day: "Tue", INR: 1500, USD: 20 },
  { day: "Wed", INR: 3000, USD: 35 },
  { day: "Thu", INR: 2500, USD: 30 },
  { day: "Fri", INR: 4000, USD: 50 },
  { day: "Sat", INR: 5000, USD: 60 },
  { day: "Sun", INR: 1000, USD: 15 },
];

export const donationDailyTrend = rawDailyTrend.map(d => ({
  ...d,
  Total: d.INR + d.USD * 80
}));
