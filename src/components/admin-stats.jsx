"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function AdminStats() {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getAdminStats();
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
      status: "Pending",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Pending"]) || 0),
        0
      ),
      color: "#fbbf24", // Yellow/Amber
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
    <div className="container mx-auto p-6 space-y-8">
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
            <CardContent className="flex justify-center">
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
                  Pending: {
                    label: "Pending",
                    color: "#fbbf24",
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
                className="h-[400px] w-full"
              >
                <BarChart
                  data={memberData}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 30,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={0}
                    textAnchor="middle"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
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

          {/* New Incharge Distribution Chart */}
          <Card className="max-w-[400px] mx-auto w-full">
            <CardHeader>
              <CardTitle>Incharge Distribution</CardTitle>
              <CardDescription>
                Distribution of contacts among incharges
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{}}
                className="h-[300px] w-full flex justify-center"
              >
                <PieChart width={300} height={300}>
                  {(() => {
                    // Calculate the data once
                    const inchargeData = memberData.map((member, index) => ({
                      name: member.name,
                      value: (Object.entries(member)
                        .filter(([key]) => key !== 'name')
                        .reduce((sum, [_, value]) => sum + (parseInt(value) || 0), 0))/2,
                      color: [
                        "#3b82f6", "#22c55e", "#f97316", "#8b5cf6",
                        "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"
                      ][index % 8]
                    }));
                    
                    
                    return (
                      <Pie
                        data={inchargeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        {inchargeData.map((entry, index) => (
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
                    );
                  })()}
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
              
              {/* Legend for Incharge Distribution */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {memberData.map((member, index) => {
                  const totalContacts = (Object.entries(member)
                    .filter(([key]) => key !== 'name')
                    .reduce((sum, [_, value]) => sum + (parseInt(value) || 0), 0))/2;
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ 
                          backgroundColor: [
                            "#3b82f6", "#22c55e", "#f97316", "#8b5cf6",
                            "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"
                          ][index % 8]
                        }}
                      />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {member.name} ({totalContacts})
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
