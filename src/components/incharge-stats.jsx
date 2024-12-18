"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
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
import { useEffect, useState } from "react";
import { getInchargeStats } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function InchargeStats() {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getInchargeStats();
        if (result.errors) {
          setError(result.errors);
        } else {
          setMemberData(result.data);
        }
      } catch (err) {
        setError("Failed to fetch statistics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Calculate status data from member data with proper number conversion
  const statusData = [
    {
      status: "Email Sent",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Email Sent"]) || 0),
        0
      ),
      color: "#3b82f6", // Blue
    },
    {
      status: "Not Called",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Not Called"]) || 0),
        0
      ),
      color: "#f97316", // Orange
    },
    {
      status: "Accepted",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Accepted"]) || 0),
        0
      ),
      color: "#22c55e", // Green
    },
    {
      status: "Declined",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Declined"]) || 0),
        0
      ),
      color: "#ef4444", // Red
    },
    {
      status: "Blacklisted",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Blacklisted"]) || 0),
        0
      ),
      color: "#1f2937", // Dark Gray
    },
  ];

  // Calculate total contacts with proper number conversion
  const totalContacts = statusData.reduce(
    (sum, item) => sum + (parseInt(item.value) || 0),
    0
  );

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

  if (memberData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No statistics available.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 mt-16">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">ED Statistics</h1>
      <div className="flex justify-center items-center">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {/* Bar Chart */}
          <Card className="md:col-span-1 lg:col-span-2 max-w-[900px] mx-auto w-full">
            <CardHeader>
              <CardTitle>Contacts per ED</CardTitle>
              <CardDescription>
                Number of contacts managed by each ED
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "Email Sent": {
                    label: "Email Sent",
                    color: "#3b82f6",
                  },
                  "Not Called": {
                    label: "Not Called",
                    color: "#f97316",
                  },
                  Accepted: {
                    label: "Accepted",
                    color: "#22c55e",
                  },
                  Declined: {
                    label: "Declined",
                    color: "#ef4444",
                  },
                  Blacklisted: {
                    label: "Blacklisted",
                    color: "#1f2937",
                  },
                }}
                className="h-[400px]"
              >
                <BarChart
                  data={memberData}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: 60,
                    left: 30,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={30}
                    angle={0}
                    textAnchor="middle"
                  />
                  <YAxis tickLine={true} axisLine={true} tickMargin={10}  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {statusData.map((status, index) => (
                    <Bar
                      key={status.status}
                      dataKey={status.status}
                      stackId="a"
                      fill={status.color}
                      radius={
                        index === 0
                          ? [0, 0, 4, 4] // bottom segment
                          : index === statusData.length - 1
                          ? [4, 4, 0, 0] // top segment
                          : 0 // middle segments
                      }
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card className="max-w-[400px] mx-auto w-full">
            <CardHeader>
              <CardTitle>Contact Status Distribution</CardTitle>
              <CardDescription>Total Contacts: {totalContacts}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{}}
                className="h-[300px] w-full flex justify-center"
              >
                <PieChart width={300} height={300}>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {statusData.map((entry, index) => (
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
                {statusData.map((item, index) => (
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
      </div>
    </div>
  );
}
