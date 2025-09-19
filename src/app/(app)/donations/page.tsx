
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, IndianRupee, Search, DollarSign, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Donation } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

const DONATIONS_STORAGE_KEY = "aim-foundation-donations";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const storedDonations = localStorage.getItem(DONATIONS_STORAGE_KEY);
    if (storedDonations) {
      const parsedDonations = JSON.parse(storedDonations);
      setDonations(parsedDonations);
      setFilteredDonations(parsedDonations);
    }
  }, []);

  useEffect(() => {
    let result = donations;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(donation =>
        donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.project.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (date?.from && date?.to) {
        result = result.filter(donation => {
            const donationDate = new Date(donation.date);
            return donationDate >= date.from! && donationDate <= date.to!;
        });
    } else if (date?.from) {
        result = result.filter(donation => new Date(donation.date) >= date.from!);
    } else if (date?.to) {
        result = result.filter(donation => new Date(donation.date) <= date.to!);
    }


    setFilteredDonations(result);
  }, [searchTerm, date, donations]);

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">Donations</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Donations</CardTitle>
          <CardDescription>Browse and manage all donation records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by donor or project..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
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
                {filteredDonations.map(donation => (
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
