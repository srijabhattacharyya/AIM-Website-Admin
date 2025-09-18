import type { User, Role, Project, Donation, Task, Upload } from './types';

export const mockUsers: Record<Role, User> = {
  Admin: { id: "user-admin-01", name: "Alex Ray", email: "alex.ray@example.com", avatarUrl: "https://picsum.photos/seed/alex/100/100", role: "Admin" },
  Manager: { id: "user-manager-01", name: "Jordan Lee", email: "jordan.lee@example.com", avatarUrl: "https://picsum.photos/seed/jordan/100/100", role: "Manager" },
  Volunteer: { id: "user-volunteer-01", name: "Casey Smith", email: "casey.smith@example.com", avatarUrl: "https://picsum.photos/seed/casey/100/100", role: "Volunteer" },
  Intern: { id: "user-intern-01", name: "Taylor Green", email: "taylor.green@example.com", avatarUrl: "https://picsum.photos/seed/taylor/100/100", role: "Intern" },
  Donor: { id: "user-donor-01", name: "Morgan Brown", email: "morgan.brown@example.com", avatarUrl: "https://picsum.photos/seed/morgan/100/100", role: "Donor" },
};

export const allMockUsers: User[] = [
  ...Object.values(mockUsers),
  { id: "user-admin-02", name: "Jamie Doe", email: "jamie.doe@example.com", avatarUrl: "https://picsum.photos/seed/jamie/100/100", role: "Admin" },
  { id: "user-manager-02", name: "Chris Wilson", email: "chris.w@example.com", avatarUrl: "https://picsum.photos/seed/chris/100/100", role: "Manager" },
];

export const mockProjects: Project[] = [
  { id: "proj-01", name: "Clean Water Initiative", description: "Providing clean and safe drinking water to rural communities.", imageUrl: "https://picsum.photos/seed/water/600/400", status: "Ongoing", progress: 75 },
  { id: "proj-02", name: "Education for All", description: "Building schools and providing educational materials for underprivileged children.", imageUrl: "https://picsum.photos/seed/education/600/400", status: "Ongoing", progress: 50 },
  { id: "proj-03", name: "Healthcare Access", description: "Setting up mobile clinics to offer free healthcare services.", imageUrl: "https://picsum.photos/seed/health/600/400", status: "Completed", progress: 100 },
  { id: "proj-04", name: "Women Empowerment Program", description: "Skill development workshops for women.", imageUrl: "https://picsum.photos/seed/women/600/400", status: "Planning", progress: 10 },
];

export const mockDonations: Donation[] = [
  { id: "don-01", donorName: "Morgan Brown", donorEmail: "morgan.brown@example.com", amount: 5000, currency: "INR", date: "2023-10-15", project: "Clean Water Initiative", receiptUrl: "#" },
  { id: "don-02", donorName: "John Doe", donorEmail: "j.doe@example.com", amount: 100, currency: "USD", date: "2023-10-20", project: "Education for All" },
  { id: "don-03", donorName: "Jane Smith", donorEmail: "jane.s@example.com", amount: 15000, currency: "INR", date: "2023-11-05", project: "Clean Water Initiative" },
  { id: "don-04", donorName: "Morgan Brown", donorEmail: "morgan.brown@example.com", amount: 200, currency: "USD", date: "2023-11-12", project: "Healthcare Access", receiptUrl: "#" },
  { id: "don-05", donorName: "Peter Jones", donorEmail: "p.jones@example.com", amount: 50, currency: "USD", date: "2023-12-01", project: "Education for All" },
];

export const mockTasks: Task[] = [
  { id: "task-01", title: "Distribute water filters in Village A", projectId: "proj-01", completed: true },
  { id: "task-02", title: "Conduct survey for new well location", projectId: "proj-01", completed: false },
  { id: "task-03", title: "Organize book donation drive", projectId: "proj-02", completed: false },
  { id: "task-04", title: "Prepare weekly progress report", projectId: "proj-02", completed: true },
];

export const mockUploads: Upload[] = [
  { id: "med-01", name: "Community Meeting", url: "https://picsum.photos/seed/media1/400/300", uploadedAt: "2023-10-05" },
  { id: "med-02", name: "School Opening", url: "https://picsum.photos/seed/media2/400/300", uploadedAt: "2023-09-20" },
  { id: "med-03", name: "Clinic Inauguration", url: "https://picsum.photos/seed/media3/400/300", uploadedAt: "2023-08-15" },
  { id: "med-04", name: "Workshop Session", url: "https://picsum.photos/seed/media4/400/300", uploadedAt: "2023-11-10" },
];

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
