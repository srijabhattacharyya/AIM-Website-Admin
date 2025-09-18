import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockDonations, mockProjects } from "@/lib/data";
import { Download, Gift, IndianRupee, MessageSquareHeart } from "lucide-react";

export default function DonorDashboard() {
  // Assuming the logged-in donor is "Morgan Brown"
  const donorDonations = mockDonations.filter(d => d.donorEmail === "morgan.brown@example.com");

  return (
    <div className="grid gap-6">
      <Alert>
        <MessageSquareHeart className="h-5 w-5" />
        <AlertTitle>Thank You!</AlertTitle>
        <AlertDescription>
          Your continued support makes a world of difference. We are incredibly grateful for your generosity.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gift />Donation History</CardTitle>
          <CardDescription>A record of your generous contributions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorDonations.map(donation => (
                <TableRow key={donation.id}>
                  <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{donation.project}</TableCell>
                  <TableCell className="font-medium">
                    {donation.currency === 'INR' ? (
                      <span className="inline-flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {donation.amount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      `$${donation.amount.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {donation.receiptUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={donation.receiptUrl}><Download className="mr-2 h-4 w-4" /> Download</a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unavailable</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Updates from Your Projects</CardTitle>
          <CardDescription>See the impact of your donations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            {mockProjects.slice(0, 2).map(project => (
                 <Card key={project.id}>
                    <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs font-semibold">Status: {project.status}</p>
                    </CardFooter>
                 </Card>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}
