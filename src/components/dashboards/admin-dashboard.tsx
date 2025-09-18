import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Briefcase, Users, Heart } from "lucide-react";
import { DonationCharts } from "@/components/charts";
import { mockDonations, mockProjects, allMockUsers } from "@/lib/data";

export default function AdminDashboard() {
  const totalDonations = mockDonations.reduce((acc, d) => acc + (d.currency === 'USD' ? d.amount * 80 : d.amount), 0);
  const totalProjects = mockProjects.length;
  const totalBeneficiaries = 12500; // Mock data
  const totalVolunteers = allMockUsers.filter(u => u.role === 'Volunteer').length;

  const stats = [
    { title: "Total Donations", value: `₹${(totalDonations).toLocaleString('en-IN')}`, icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
    { title: "Active Projects", value: totalProjects, icon: <Briefcase className="h-6 w-6 text-muted-foreground" /> },
    { title: "Beneficiaries Reached", value: totalBeneficiaries.toLocaleString(), icon: <Heart className="h-6 w-6 text-muted-foreground" /> },
    { title: "Volunteers", value: totalVolunteers, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DonationCharts />
    </div>
  );
}
