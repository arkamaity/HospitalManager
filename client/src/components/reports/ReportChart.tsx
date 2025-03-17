import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ChartType = "bar" | "line" | "pie";

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ReportChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  type: ChartType;
  xAxisDataKey?: string;
  dataKeys: string[];
  colors?: string[];
  height?: number;
}

const ReportChart = ({
  title,
  description,
  data,
  type,
  xAxisDataKey = "name",
  dataKeys,
  colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"],
  height = 300,
}: ReportChartProps) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Bar
                  key={dataKey}
                  dataKey={dataKey}
                  fill={colors[index % colors.length]}
                  name={dataKey}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisDataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((dataKey, index) => (
                <Line
                  key={dataKey}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                  name={dataKey}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKeys[0]}
                nameKey={xAxisDataKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, dataKeys[0]]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Invalid chart type</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

export default ReportChart;
