"use client";

import { Card } from "@/components/ui/card";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
  Label,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];

  xAxisLabel: string;
  yAxisLabel: string;
}

export const Chart = ({ data, xAxisLabel, yAxisLabel }: ChartProps) => {
  const filteredData = data
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));

  return (
    <Card>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "600px" }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              >
                <Label
                  value={xAxisLabel || ""}
                  offset={10}
                  position="bottom"
                  fontSize={10}
                />
              </XAxis>
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              >
                <Label
                  value={yAxisLabel || ""}
                  angle={-90}
                  position="outside"
                  fontSize={10}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                formatter={(value, name) => {
                  const label = String(name);
                  const capitalizedLabel =
                    label.charAt(0).toUpperCase() + label.slice(1);
                  return [value, capitalizedLabel];
                }}
              />
              <Bar dataKey="total" fill="#0369a1" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="total"
                  position="top"
                  fill="#fff"
                  fontSize={14}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
