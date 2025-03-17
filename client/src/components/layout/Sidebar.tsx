import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Users, 
  User, 
  Calendar, 
  FileText, 
  DollarSign, 
  AreaChart, 
  Settings 
} from "lucide-react";

const sidebarItems = [
  { 
    path: "/dashboard", 
    label: "Dashboard", 
    icon: BarChart3 
  },
  { 
    path: "/patients", 
    label: "Patients", 
    icon: Users 
  },
  { 
    path: "/doctors", 
    label: "Doctors & Staff", 
    icon: User 
  },
  { 
    path: "/appointments", 
    label: "Appointments", 
    icon: Calendar 
  },
  { 
    path: "/records", 
    label: "Medical Records", 
    icon: FileText 
  },
  { 
    path: "/billing", 
    label: "Billing", 
    icon: DollarSign 
  },
  { 
    path: "/reports", 
    label: "Reports", 
    icon: AreaChart 
  },
  { 
    path: "/settings", 
    label: "Settings", 
    icon: Settings 
  }
];

const Sidebar = () => {
  const [location] = useLocation();

  return (
    <aside className="sidebar w-64 bg-white shadow-md flex-shrink-0 overflow-y-auto hidden lg:block">
      <nav className="mt-2">
        <ul>
          {sidebarItems.map((item) => {
            const isActive = location === item.path || 
                            (location === "/" && item.path === "/dashboard") ||
                            (location.startsWith(item.path + "/") && item.path !== "/dashboard");
            
            const IconComponent = item.icon;
                            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`sidebar-item flex items-center px-4 py-3 text-neutral-800 hover:bg-neutral-100 ${
                    isActive ? "active bg-blue-50 border-l-3 border-primary" : ""
                  }`}>
                    <IconComponent className={`h-5 w-5 mr-3 ${isActive ? "text-primary" : "text-neutral-500"}`} />
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
