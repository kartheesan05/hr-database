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
    {
      status: "Accepted",
      value: memberData.reduce(
        (sum, member) => sum + (parseInt(member["Accepted"]) || 0),
        0
      ),
      color: "#22c55e", // Green
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
    <div className="container mx-auto p-2 sm:p-6 space-y-4 sm:space-y-8">
      <div className="flex justify-center items-center">
        <div className="grid gap-4 sm:gap-8 w-full max-w-[1400px]">
          {/* Bar Chart */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Contacts per ED
              </CardTitle>
              <CardDescription className="text-sm">
                Number of contacts managed by each ED
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center overflow-x-auto pb-6">
              <ChartContainer
                config={{
                  Declined: {
                    label: "Declined",
                    color: "#ef4444",
                  },
                  Blacklisted: {
                    label: "Blacklisted",
                    color: "#1f2937",
                  },
                  Accepted: {
                    label: "Accepted",
                    color: "#22c55e",
                  },
                  Pending: {
                    label: "Pending",
                    color: "#fbbf24",
                  },
                  "Email Sent": {
                    label: "Email Sent",
                    color: "#3b82f6",
                  },
                  "Not Called": {
                    label: "Not Called",
                    color: "#f97316",
                  },
                }}
                className="h-[300px] sm:h-[400px] w-full min-w-[600px] max-w-[1200px]"
              >
                <BarChart
                  data={memberData}
                  margin={{
                    top: 20,
                    right: 40,
                    bottom: 20,
                    left: 40,
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

          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Donut Chart */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Contact Status Distribution
                </CardTitle>
                <CardDescription>
                  Total Contacts: {totalContacts}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4">
                <ChartContainer
                  config={{}}
                  className="h-[300px] w-full max-w-[400px]"
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
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-[400px]">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {item.status} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Incharge Distribution Chart */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Incharge Distribution
                </CardTitle>
                <CardDescription>
                  Distribution of contacts among incharges
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-4">
                <ChartContainer
                  config={{}}
                  className="h-[300px] w-full max-w-[400px]"
                >
                  <PieChart width={300} height={300}>
                    {(() => {
                      // Calculate the data once
                      const inchargeData = memberData.map((member, index) => ({
                        name: member.name,
                        value:
                          Object.entries(member)
                            .filter(([key]) => key !== "name")
                            .reduce(
                              (sum, [_, value]) => sum + (parseInt(value) || 0),
                              0
                            ) / 2,
                        color: [
                          "#3b82f6",
                          "#22c55e",
                          "#f97316",
                          "#8b5cf6",
                          "#ec4899",
                          "#14b8a6",
                          "#f59e0b",
                          "#6366f1",
                        ][index % 8],
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
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
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

                {/* Legend */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-[400px]">
                  {memberData.map((member, index) => {
                    const totalContacts =
                      Object.entries(member)
                        .filter(([key]) => key !== "name")
                        .reduce(
                          (sum, [_, value]) => sum + (parseInt(value) || 0),
                          0
                        ) / 2;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: [
                              "#3b82f6",
                              "#22c55e",
                              "#f97316",
                              "#8b5cf6",
                              "#ec4899",
                              "#14b8a6",
                              "#f59e0b",
                              "#6366f1",
                            ][index % 8],
                          }}
                        />
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
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
    </div>
  );
}
