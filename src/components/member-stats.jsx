"use client";

import { useEffect, useState } from "react";
import { getMemberStats } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function MemberStats() {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getMemberStats();
        if (result.errors) {
          setError(result.errors);
        } else {
          setStatsData(result.data);
        }
      } catch (err) {
        setError("Failed to fetch statistics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!statsData) {
    return (
      <div className="text-center py-8 text-gray-500">
        No statistics available.
      </div>
    );
  }

  // Transform the data for the pie chart
  const chartData = [
    {
      status: "Emailed Declined",
      value: parseInt(statsData["Emailed Declined"] || 0),
      color: "#ef4444", // Red
    },
    {
      status: "Called Declined",
      value: parseInt(statsData["Called Declined"] || 0),
      color: "#ef4444", // Red
    },
    {
      status: "Blacklisted",
      value: parseInt(statsData["Blacklisted"] || 0),
      color: "#1f2937", // Dark Gray
    },
    {
      status: "Accepted Invite",
      value: parseInt(statsData["Accepted Invite"] || 0),
      color: "#22c55e", // Green
    },
    {
      status: "Awaiting Response",
      value: parseInt(statsData["Awaiting Response"] || 0),
      color: "#fbbf24", // Yellow/Amber
    },
    {
      status: "Email Sent",
      value: parseInt(statsData["Email Sent"] || 0),
      color: "#3b82f6", // Blue
    },
    {
      status: "Called Postponed",
      value: parseInt(statsData["Called Postponed"] || 0),
      color: "#14b8a6", // Teal
    },
    {
      status: "Wrong Number",
      value: parseInt(statsData["Wrong Number"] || 0),
      color: "#ec4899", // Pink
    },
    {
      status: "Not Reachable",
      value: parseInt(statsData["Not Reachable"] || 0),
      color: "#9333ea", // Purple
    },
    {
      status: "Not Called",
      value: parseInt(statsData["Not Called"] || 0),
      color: "#f97316", // Orange
    },
  ];

  const totalContacts = parseInt(statsData.total_contacts || 0);

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-[400px] mx-auto w-full">
        <CardHeader>
          <CardTitle>Your Contact Status Distribution</CardTitle>
          <CardDescription>Total Contacts: {totalContacts}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ChartContainer
            config={{}}
            className="h-[300px] w-full flex justify-center"
          >
            <PieChart width={300} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalContacts}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Contacts
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
          </ChartContainer>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {item.status} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
