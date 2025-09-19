"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Briefcase, Users, Heart, IndianRupee } from "lucide-react";
import { DonationCharts } from "@/components/charts";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import type { Donation, Project, User } from "@/lib/types";

const DONATIONS_STORAGE_KEY = "aim-foundation-donations";
const PROJECTS_STORAGE_KEY = "aim-foundation-projects";
const USERS_STORAGE_KEY = "aim-foundation-users";

export default function AdminDashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedDonations = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if(storedDonations) setDonations(JSON.parse(storedDonations));

    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if(storedProjects) setProjects(JSON.parse(storedProjects));

    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if(storedUsers) setUsers(JSON.parse(storedUsers));
  }, [])


  const totalDonationsINR = donations
    .filter(d => d.currency === 'INR')
    .reduce((acc, d) => acc + d.amount, 0);
  const totalDonationsUSD = donations
    .filter(d => d.currency === 'USD')
    .reduce((acc, d) => acc + d.amount, 0);

  const totalProjects = projects.length;
  const totalBeneficiaries = 12500; // Mock data
  const totalVolunteers = users.filter(u => u.role === 'Volunteer').length;

  const projectDonationProgress = projects.map(project => {
    const projectDonations = donations.filter(d => d.project === project.name);
    const totalDonated = projectDonations.reduce((acc, d) => {
      // Normalize USD to INR for progress calculation
      const amountInINR = d.currency === 'USD' ? d.amount * 80 : d.amount;
      return acc + amountInINR;
    }, 0);
    const budget = project.budget || 0;
    const progress = budget > 0 ? (totalDonated / budget) * 100 : 0;
    return {
      ...project,
      totalDonated,
      progress,
    };
  });

  const stats = [
    { title: "Donations (INR)", value: <div className="flex items-center"><IndianRupee className="h-6 w-6 mr-1" />{totalDonationsINR.toLocaleString('en-IN')}</div>, icon: <IndianRupee className="h-6 w-6 text-muted-foreground" /> },
    { title: "Donations (USD)", value: `$${totalDonationsUSD.toLocaleString()}`, icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
    { title: "Active Projects", value: totalProjects.toLocaleString(), icon: <Briefcase className="h-6 w-6 text-muted-foreground" /> },
    { title: "Beneficiaries Reached", value: totalBeneficiaries.toLocaleString(), icon: <Heart className="h-6 w-6 text-muted-foreground" /> },
    { title: "Volunteers", value: totalVolunteers.toLocaleString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Fundraising Progress</CardTitle>
          <CardDescription>Donations received against project budgets (in INR).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectDonationProgress.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{project.name}</span>
                  <div className="text-sm flex items-center">
                    <span className="flex items-center text-primary font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {project.totalDonated.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="flex items-center text-foreground font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {(project.budget || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <Progress value={project.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <DonationCharts />
    </div>
  );
}
