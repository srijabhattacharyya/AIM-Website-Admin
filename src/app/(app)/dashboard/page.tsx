"use client";

import { useAuth } from "@/hooks/use-auth";
import AdminDashboard from "@/components/dashboards/admin-dashboard";
import ManagerDashboard from "@/components/dashboards/manager-dashboard";
import VolunteerDashboard from "@/components/dashboards/volunteer-dashboard";
import InternDashboard from "@/components/dashboards/intern-dashboard";
import DonorDashboard from "@/components/dashboards/donor-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; 
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "Admin":
        return <AdminDashboard />;
      case "Manager":
        return <ManagerDashboard />;
      case "Volunteer":
        return <VolunteerDashboard />;
      case "Intern":
        return <InternDashboard />;
      case "Donor":
        return <DonorDashboard />;
      default:
        return (
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p className="text-muted-foreground">Your dashboard is being set up.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
        Welcome back, {user.name.split(" ")[0]}!
      </h1>
      {renderDashboard()}
    </div>
  );
}
