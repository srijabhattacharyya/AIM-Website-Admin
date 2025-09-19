
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ReportGenerator from "@/components/report-generator";
import { IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import type { Donation, Project } from "@/lib/types";

const PROJECTS_STORAGE_KEY = "aim-foundation-projects";
const DONATIONS_STORAGE_KEY = "aim-foundation-donations";

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if(storedProjects) setProjects(JSON.parse(storedProjects));

    const storedDonations = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if(storedDonations) setDonations(JSON.parse(storedDonations));
  }, [])


  const donationsByProject = projects.map(p => {
    const projectDonations = donations.filter(d => d.project === p.name);
    const total = projectDonations.reduce((acc, d) => acc + (d.currency === 'USD' ? d.amount * 80 : d.amount), 0);
    return { name: p.name, total };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Overview of current project statuses and progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Donations by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Total Donations (INR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donationsByProject.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right flex items-center justify-end">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {p.total.toLocaleString('en-IN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <ReportGenerator />
      </div>
    </div>
  );
}
