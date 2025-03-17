import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Printer } from "lucide-react";
import ReportChart from "@/components/reports/ReportChart";

const Reports = () => {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("department");

  // Sample data for reports
  const departmentAdmissionsData = [
    { name: "Cardiology", value: 42, fill: "var(--chart-1)" },
    { name: "Neurology", value: 28, fill: "var(--chart-2)" },
    { name: "Orthopedics", value: 36, fill: "var(--chart-3)" },
    { name: "Pediatrics", value: 22, fill: "var(--chart-4)" },
    { name: "General", value: 57, fill: "var(--chart-5)" },
  ];

  const monthlyAppointmentsData = [
    { name: "Jan", appointments: 120, noShows: 8 },
    { name: "Feb", appointments: 132, noShows: 10 },
    { name: "Mar", appointments: 141, noShows: 12 },
    { name: "Apr", appointments: 158, noShows: 9 },
    { name: "May", appointments: 145, noShows: 11 },
    { name: "Jun", appointments: 162, noShows: 14 },
    { name: "Jul", appointments: 159, noShows: 10 },
    { name: "Aug", appointments: 170, noShows: 12 },
    { name: "Sep", appointments: 166, noShows: 9 },
    { name: "Oct", appointments: 183, noShows: 15 },
    { name: "Nov", appointments: 178, noShows: 13 },
    { name: "Dec", appointments: 160, noShows: 10 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 34500, expenses: 28700 },
    { name: "Feb", revenue: 36200, expenses: 28900 },
    { name: "Mar", revenue: 39800, expenses: 30400 },
    { name: "Apr", revenue: 41500, expenses: 31200 },
    { name: "May", revenue: 42700, expenses: 32500 },
    { name: "Jun", revenue: 45900, expenses: 33800 },
    { name: "Jul", revenue: 44300, expenses: 33200 },
    { name: "Aug", revenue: 47800, expenses: 35100 },
    { name: "Sep", revenue: 46500, expenses: 34200 },
    { name: "Oct", revenue: 49700, expenses: 36800 },
    { name: "Nov", revenue: 48200, expenses: 36100 },
    { name: "Dec", revenue: 45600, expenses: 34500 },
  ];

  const resourceUtilizationData = [
    { name: "Beds", utilized: 85, available: 15 },
    { name: "ICU", utilized: 80, available: 20 },
    { name: "OR", utilized: 50, available: 50 },
    { name: "Ventilators", utilized: 40, available: 60 },
    { name: "Doctors", utilized: 75, available: 25 },
    { name: "Nurses", utilized: 82, available: 18 },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Reports & Analytics</h1>
          <p className="text-neutral-500">Generate and view hospital performance reports</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Settings</CardTitle>
          <CardDescription>
            Configure report parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-2">
                Date Range
              </label>
              <Select defaultValue={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 3 months</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-2">
                Report Type
              </label>
              <Select defaultValue={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department Statistics</SelectItem>
                  <SelectItem value="appointments">Appointment Analytics</SelectItem>
                  <SelectItem value="revenue">Revenue & Expenses</SelectItem>
                  <SelectItem value="resources">Resource Utilization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="charts" className="mb-6">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportChart
              title="Department Admissions"
              description="Patient admissions by department"
              data={departmentAdmissionsData}
              type="pie"
              dataKeys={["value"]}
            />
            
            <ReportChart
              title="Monthly Appointments"
              description="Appointments and no-shows by month"
              data={monthlyAppointmentsData}
              type="bar"
              dataKeys={["appointments", "noShows"]}
            />
            
            <ReportChart
              title="Revenue vs Expenses"
              description="Financial overview by month"
              data={revenueData}
              type="line"
              dataKeys={["revenue", "expenses"]}
            />
            
            <ReportChart
              title="Resource Utilization"
              description="Current utilization of hospital resources"
              data={resourceUtilizationData}
              type="bar"
              dataKeys={["utilized", "available"]}
            />
          </div>
        </TabsContent>
        <TabsContent value="tables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tabular Data</CardTitle>
              <CardDescription>View report data in table format</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-neutral-500">
                Table view is currently under development. Please check back later.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
              <CardDescription>Key insights and executive summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Key Insights</h3>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>Patient admissions increased by 12% compared to the previous period</li>
                    <li>Cardiology department shows the highest number of patient visits</li>
                    <li>Appointment no-show rate has decreased to 6.8% (down from 8.2%)</li>
                    <li>Revenue has increased by 8.2% while expenses grew by only 5.4%</li>
                    <li>Bed occupancy remains high at 85%, suggesting potential capacity issues</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Recommendations</h3>
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>Consider expanding cardiology department capacity due to high demand</li>
                    <li>Continue with the appointment reminder system that has reduced no-shows</li>
                    <li>Review bed allocation and discharge processes to optimize occupancy</li>
                    <li>Investigate operating room utilization for potential efficiency improvements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
