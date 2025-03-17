import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  UserCheck, 
  DollarSign
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentTable from "@/components/dashboard/AppointmentTable";
import RecentPatients from "@/components/dashboard/RecentPatients";
import ResourceUtilization from "@/components/dashboard/ResourceUtilization";
import BillingActivity from "@/components/dashboard/BillingActivity";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@shared/schema";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(format(new Date(), "EEEE, MMMM d, yyyy"));
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500">Welcome back, Dr. Johnson. Here's what's happening today.</p>
      </div>

      {/* Date & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-neutral-600 mb-4 md:mb-0">
          <span className="font-semibold">{currentDate}</span>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search patients, doctors, etc." 
              className="pl-10 pr-4 py-2 w-full md:w-64 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded" />
                </div>
                <div className="mt-3">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard 
              title="Today's Appointments"
              value={dashboardStats?.todayAppointments || 0}
              icon={Calendar}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
              change={{
                value: "2.5%",
                isPositive: true,
                label: "from yesterday"
              }}
              border="border-primary"
            />
            
            <StatCard 
              title="Admitted Patients"
              value={dashboardStats?.admittedPatients || 0}
              icon={Users}
              iconColor="text-secondary"
              iconBgColor="bg-secondary-light"
              change={{
                value: `${dashboardStats?.occupancyRate || 0}%`,
                isPositive: true,
                label: "occupancy rate"
              }}
              border="border-secondary"
            />
            
            <StatCard 
              title="Available Doctors"
              value={dashboardStats?.availableDoctors || 0}
              icon={UserCheck}
              iconColor="text-info"
              iconBgColor="bg-info"
              change={{
                value: dashboardStats?.onLeaveCount || 0,
                isPositive: false,
                label: "on leave today"
              }}
              border="border-info"
            />
            
            <StatCard 
              title="Today's Revenue"
              value={`$${dashboardStats?.todayRevenue.toLocaleString() || 0}`}
              icon={DollarSign}
              iconColor="text-warning"
              iconBgColor="bg-warning"
              change={{
                value: `${dashboardStats?.weekChange || 0}%`,
                isPositive: true,
                label: "from last week"
              }}
              border="border-warning"
            />
          </>
        )}
      </div>

      {/* Today's Appointments & Recent Patients Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AppointmentTable />
        <RecentPatients />
      </div>

      {/* Resource Utilization & Billing Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ResourceUtilization />
        <BillingActivity />
      </div>
    </div>
  );
};

export default Dashboard;
