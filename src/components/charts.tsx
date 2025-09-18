"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { donationMonthlyTrend, donationWeeklyTrend, donationDailyTrend } from "@/lib/data"
import { useState } from "react"

const chartConfig = {
  INR: {
    label: "INR",
    color: "hsl(var(--primary))",
  },
  USD: {
    label: "USD",
    color: "hsl(var(--accent))",
  },
  Total: {
    label: "Total (INR)",
    color: "hsl(var(--secondary-foreground))",
  }
} satisfies ChartConfig

type TrendData = {
  month?: string;
  day?: string;
  week?: string;
  INR: number;
  USD: number;
  Total: number;
}

export function DonationCharts() {
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly" | "daily">("monthly");

  const trends = {
    monthly: donationMonthlyTrend,
    weekly: donationWeeklyTrend,
    daily: donationDailyTrend,
  };

  const dataKey = {
    monthly: "month",
    weekly: "week",
    daily: "day",
  };

  const currentData = trends[timeframe];
  const currentDataKey = dataKey[timeframe];

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Donation Trends</CardTitle>
          <CardDescription>January - June 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={donationMonthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis 
                tickFormatter={(value) => `₹${value / 1000}k`}
                yAxisId="left"
              />
              <YAxis 
                orientation="right"
                tickFormatter={(value) => `$${value}`}
                yAxisId="right"
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line dataKey="INR" type="monotone" stroke="var(--color-INR)" strokeWidth={2} dot={false} yAxisId="left" />
              <Line dataKey="USD" type="monotone" stroke="var(--color-USD)" strokeWidth={2} dot={false} yAxisId="right" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <Tabs defaultValue="monthly" onValueChange={(value) => setTimeframe(value as any)}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Donations by Currency</CardTitle>
                <CardDescription>View by daily, weekly, or monthly</CardDescription>
              </div>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value={timeframe}>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={currentData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey={currentDataKey} tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="Total" fill="var(--color-Total)" radius={4} />
                    <Bar dataKey="INR" fill="var(--color-INR)" radius={4} />
                    <Bar dataKey="USD" fill="var(--color-USD)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
            </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
