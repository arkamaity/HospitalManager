import { Link, useLocation } from "wouter";
import { BarChart3, Users, Calendar, FileText, MoreHorizontal } from "lucide-react";

const MobileNav = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || 
           (location === "/" && path === "/dashboard") ||
           (location.startsWith(path + "/") && path !== "/dashboard");
  };

  return (
    <div className="lg:hidden bg-white border-t border-neutral-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <a className={`flex flex-col items-center py-2 ${isActive("/dashboard") ? "text-primary" : "text-neutral-500"}`}>
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/patients">
          <a className={`flex flex-col items-center py-2 ${isActive("/patients") ? "text-primary" : "text-neutral-500"}`}>
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Patients</span>
          </a>
        </Link>
        <Link href="/appointments">
          <a className={`flex flex-col items-center py-2 ${isActive("/appointments") ? "text-primary" : "text-neutral-500"}`}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Appointments</span>
          </a>
        </Link>
        <Link href="/records">
          <a className={`flex flex-col items-center py-2 ${isActive("/records") ? "text-primary" : "text-neutral-500"}`}>
            <FileText className="h-6 w-6" />
            <span className="text-xs mt-1">Records</span>
          </a>
        </Link>
        <Link href="#more">
          <a className="flex flex-col items-center py-2 text-neutral-500">
            <MoreHorizontal className="h-6 w-6" />
            <span className="text-xs mt-1">More</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
