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
import { getInchargeStats } from "@/lib/actions";
import { Loader2 } from "lucide-react";

export default function InchargeStats({ inchargeEmail }) {
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getInchargeStats(inchargeEmail);
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
      status: "Called Declined",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Called Declined"]) || 0),
        0
      ),
      color: "#ef4444", // Red
    },
    {
      status: "Emailed Declined",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Emailed Declined"]) || 0),
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
    {
      status: "Accepted Invite",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Accepted Invite"]) || 0),
        0
      ),
      color: "#22c55e", // Green
    },
    {
      status: "Awaiting Response",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Awaiting Response"]) || 0),
        0
      ),
      color: "#fbbf24", // Yellow/Amber
    },
    {
      status: "Email Sent",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Email Sent"]) || 0),
        0
      ),
      color: "#3b82f6", // Blue
    },
    {
      status: "Called Postponed",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Called Postponed"]) || 0),
        0
      ),
      color: "#14b8a6", // Teal
    },
    {
      status: "Wrong Number",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Wrong Number"]) || 0),
        0
      ),
      color: "#ec4899", // Pink
    },
    {
      status: "Not Reachable",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Not Reachable"]) || 0),
        0
      ),
      color: "#9333ea", // Purple
    },
    {
      status: "Not Called",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Not Called"]) || 0),
        0
      ),
      color: "#f97316", // Orange
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
          <Card className="md:col-span-1 lg:col-span-2 max-w-[900px] mx-auto w-full pb-3">
            <CardHeader>
              <CardTitle>Contacts per Member</CardTitle>
              <CardDescription>
                Number of contacts managed by each Member
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer
                config={{
                  "Called Declined": {
                    label: "Called Declined",
                    color: "#ef4444",
                  },
                  "Emailed Declined": {
                    label: "Emailed Declined",
                    color: "#ef4444",
                  },
                  "Blacklisted": {
                    label: "Blacklisted",
                    color: "#1f2937",
                  },
                  "Accepted Invite": {
                    label: "Accepted Invite",
                    color: "#22c55e",
                  },
                  "Awaiting Response": {
                    label: "Awaiting Response",
                    color: "#fbbf24",
                  },
                  "Email Sent": {
                    label: "Email Sent",
                    color: "#3b82f6",
                  },
                  "Called Postponed": {
                    label: "Called Postponed",
                    color: "#14b8a6",
                  },
                  "Wrong Number": {
                    label: "Wrong Number",
                    color: "#ec4899",
                  },
                  "Not Reachable": {
                    label: "Not Reachable",
                    color: "#9333ea",
                  },
                  "Not Called": {
                    label: "Not Called",
                    color: "#f97316",
                  },
                }}
                className="h-[300px] sm:h-[400px] min-w-[600px]"
              >
                <BarChart
                  data={memberData}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: 40,
                    left: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {statusData.map((status, index) => (
                    <Bar
                      key={status.status}
                      dataKey={status.status}
                      stackId="a"
                      fill={status.color}
                      radius={
                        index === 0
                          ? [0, 0, 4, 4]
                          : index === statusData.length - 1
                          ? [4, 4, 0, 0]
                          : 0
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

          {/* Member Distribution Card */}
          <Card className="max-w-[400px] mx-auto w-full">
            <CardHeader>
              <CardTitle>Contact Distribution by Member</CardTitle>
              <CardDescription>
                How contacts are distributed across members
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ChartContainer
                config={{}}
                className="h-[300px] w-full flex justify-center"
              >
                <PieChart width={300} height={300}>
                  <Pie
                    data={memberData.map((member, index) => ({
                      name: member.name,
                      value: parseInt(member.contacts) || 0,
                      color: [
                        "#3b82f6", // Blue
                        "#22c55e", // Green
                        "#f97316", // Orange
                        "#8b5cf6", // Purple
                        "#ec4899", // Pink
                        "#14b8a6", // Teal
                        "#f59e0b", // Amber
                        "#6366f1", // Indigo
                        "#ef4444", // Red
                        "#84cc16", // Lime
                        "#06b6d4", // Cyan
                        "#d946ef", // Fuchsia
                        "#0ea5e9", // Sky
                        "#64748b", // Slate
                        "#a855f7", // Purple
                        "#f43f5e", // Rose
                        "#0891b2", // Cyan Dark
                        "#059669", // Emerald
                        "#7c3aed", // Violet
                        "#ea580c", // Orange Dark
                      ][index % 20],
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {memberData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#3b82f6", // Blue
                            "#22c55e", // Green
                            "#f97316", // Orange
                            "#8b5cf6", // Purple
                            "#ec4899", // Pink
                            "#14b8a6", // Teal
                            "#f59e0b", // Amber
                            "#6366f1", // Indigo
                            "#ef4444", // Red
                            "#84cc16", // Lime
                            "#06b6d4", // Cyan
                            "#d946ef", // Fuchsia
                            "#0ea5e9", // Sky
                            "#64748b", // Slate
                            "#a855f7", // Purple
                            "#f43f5e", // Rose
                            "#0891b2", // Cyan Dark
                            "#059669", // Emerald
                            "#7c3aed", // Violet
                            "#ea580c", // Orange Dark
                          ][index % 20]
                        }
                      />
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
                {memberData.map((member, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "#3b82f6", // Blue
                          "#22c55e", // Green
                          "#f97316", // Orange
                          "#8b5cf6", // Purple
                          "#ec4899", // Pink
                          "#14b8a6", // Teal
                          "#f59e0b", // Amber
                          "#6366f1", // Indigo
                          "#ef4444", // Red
                          "#84cc16", // Lime
                          "#06b6d4", // Cyan
                          "#d946ef", // Fuchsia
                          "#0ea5e9", // Sky
                          "#64748b", // Slate
                          "#a855f7", // Purple
                          "#f43f5e", // Rose
                          "#0891b2", // Cyan Dark
                          "#059669", // Emerald
                          "#7c3aed", // Violet
                          "#ea580c", // Orange Dark
                        ][index % 20],
                      }}
                    />
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {member.name} ({member.contacts})
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
