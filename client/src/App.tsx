import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Layout components
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

// Pages
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import PatientDetail from "@/pages/PatientDetail";
import Doctors from "@/pages/Doctors";
import DoctorDetail from "@/pages/DoctorDetail";
import Appointments from "@/pages/Appointments";
import MedicalRecords from "@/pages/MedicalRecords";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-neutral-100 p-4">
          <div className="mx-auto max-w-7xl">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/patients" component={Patients} />
              <Route path="/patients/:id" component={PatientDetail} />
              <Route path="/doctors" component={Doctors} />
              <Route path="/doctors/:id" component={DoctorDetail} />
              <Route path="/appointments" component={Appointments} />
              <Route path="/records" component={MedicalRecords} />
              <Route path="/billing" component={Billing} />
              <Route path="/reports" component={Reports} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
      
      <MobileNav />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
