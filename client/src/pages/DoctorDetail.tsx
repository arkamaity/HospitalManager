import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Edit, 
  Trash2,
  Printer,
  Clock,
  Users,
  ArrowRightCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import DoctorForm from "@/components/doctors/DoctorForm";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import type { Doctor } from "@shared/schema";

const DoctorDetail = () => {
  const params = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: doctor, isLoading, error } = useQuery<Doctor>({
    queryKey: [`/api/doctors/${params.id}`],
  });

  const handleEditDoctor = () => {
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const handleDeleteDoctor = async () => {
    if (window.confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/doctors/${params.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        
        if (response.ok) {
          navigate("/doctors");
        } else {
          alert("Failed to delete doctor.");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("An error occurred while deleting the doctor.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-destructive">Error loading doctor</h2>
        <p className="text-neutral-500 mt-2">Could not load doctor information</p>
        <Button asChild className="mt-4">
          <Link href="/doctors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors List
          </Link>
        </Button>
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div>
        <Button variant="outline" onClick={() => setShowEditForm(false)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctor Details
        </Button>
        <DoctorForm 
          isEditing 
          doctorId={doctor.doctorId}
          defaultValues={doctor} 
          onSuccess={handleEditSuccess} 
        />
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-4">
        <Link href="/doctors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Doctors List
        </Link>
      </Button>

      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} />
              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-800">{doctor.name}</h1>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {doctor.specialization}
                </Badge>
                {doctor.department && (
                  <Badge variant="outline" className="ml-2">
                    {doctor.department}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveTab("appointments")}>
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Button>
            <Button onClick={handleEditDoctor}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Full Name</p>
                      <p className="font-medium">{doctor.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Doctor ID</p>
                      <p className="font-medium">{doctor.doctorId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Specialization</p>
                      <p className="font-medium">{doctor.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Department</p>
                      <p className="font-medium">{doctor.department || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Phone</p>
                      <p className="font-medium">{doctor.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-medium">{doctor.email || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Schedule Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-neutral-500">Today</p>
                      <p className="text-xl font-bold text-primary">6 Appointments</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-neutral-500">This Week</p>
                      <p className="text-xl font-bold text-green-600">28 Appointments</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-neutral-500">Available Slots</p>
                      <p className="text-xl font-bold text-purple-600">12 Slots</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm text-neutral-500">On Leave</p>
                      <p className="text-xl font-bold text-amber-600">Oct 25-27</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("appointments")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    View Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Patients
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Manage Availability
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full justify-start">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Schedule
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteDoctor}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Doctor
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium">Appointment Complete</p>
                    <p className="text-xs text-neutral-500">Today, 11:30 AM</p>
                  </div>
                  <div className="border-l-2 border-info pl-4">
                    <p className="text-sm font-medium">Medical Record Updated</p>
                    <p className="text-xs text-neutral-500">Today, 9:15 AM</p>
                  </div>
                  <div className="border-l-2 border-warning pl-4">
                    <p className="text-sm font-medium">Schedule Modified</p>
                    <p className="text-xs text-neutral-500">Yesterday, 4:45 PM</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">
                    View All Activity
                    <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsList doctorId={doctor.doctorId} />
        </TabsContent>
        
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Patients under the care of {doctor.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-neutral-500 py-6">
                Patient list functionality coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDetail;
