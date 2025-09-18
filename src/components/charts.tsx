"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { donationMonthlyTrend } from "@/lib/data"

const chartConfig = {
  INR: {
    label: "INR",
    color: "hsl(var(--primary))",
  },
  USD: {
    label: "USD",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function DonationCharts() {
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
        <CardHeader>
          <CardTitle>Donations by Currency</CardTitle>
          <CardDescription>January - June 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={donationMonthlyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="INR" fill="var(--color-INR)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
