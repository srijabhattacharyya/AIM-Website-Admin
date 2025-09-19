
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, IndianRupee, Search, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import type { Donation } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

const DONATIONS_STORAGE_KEY = "aim-foundation-donations";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const storedDonations = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if (storedDonations) {
      setDonations(JSON.parse(storedDonations));
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Donations</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
          <CardDescription>Browse and manage all donation records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by donor or project..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <ScrollArea className="whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>PAN</TableHead>
                  <TableHead>Aadhaar</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>PIN</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Amount (INR)</TableHead>
                  <TableHead>Amount (USD)</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map(donation => (
                  <TableRow key={donation.id}>
                    <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{donation.donorName}</TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell>{donation.mobileNumber}</TableCell>
                    <TableCell>{donation.pan}</TableCell>
                    <TableCell>{donation.aadhaar}</TableCell>
                    <TableCell>{new Date(donation.dob).toLocaleDateString()}</TableCell>
                    <TableCell>{donation.country}</TableCell>
                    <TableCell>{donation.state}</TableCell>
                    <TableCell>{donation.city}</TableCell>
                    <TableCell>{donation.pin}</TableCell>
                    <TableCell>{donation.address}</TableCell>
                    <TableCell>
                      {donation.currency === "INR" ? (
                        <span className="inline-flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {donation.amount.toLocaleString('en-IN')}
                        </span>
                      ) : '-'}
                    </TableCell>
                     <TableCell>
                      {donation.currency === "USD" ? (
                        <span className="inline-flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {donation.amount.toLocaleString()}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{donation.project}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
