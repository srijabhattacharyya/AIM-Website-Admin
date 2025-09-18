import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockDonations } from "@/lib/data";
import { Download, Search } from "lucide-react";

export default function DonationsPage() {
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDonations.map(donation => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.donorName}</TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell>
                      {donation.currency === "INR" ? `₹${donation.amount.toLocaleString('en-IN')}` : `$${donation.amount.toLocaleString()}`}
                    </TableCell>
                    <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                    <TableCell>{donation.project}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
