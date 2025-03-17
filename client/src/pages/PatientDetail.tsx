import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  DollarSign, 
  Edit, 
  Trash2,
  Clipboard,
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
import PatientForm from "@/components/patients/PatientForm";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import RecordsList from "@/components/medical-records/RecordsList";
import BillingList from "@/components/billing/BillingList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import type { Patient } from "@shared/schema";

const PatientDetail = () => {
  const params = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: patient, isLoading, error } = useQuery<Patient>({
    queryKey: [`/api/patients/${params.id}`],
  });

  const handleEditPatient = () => {
    setShowEditForm(true);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const handleDeletePatient = async () => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/patients/${params.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        
        if (response.ok) {
          navigate("/patients");
        } else {
          alert("Failed to delete patient.");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("An error occurred while deleting the patient.");
      }
    }
  };

  const handleScheduleAppointment = () => {
    setShowAppointmentForm(true);
    setActiveTab("appointments");
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentForm(false);
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

  if (error || !patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-destructive">Error loading patient</h2>
        <p className="text-neutral-500 mt-2">Could not load patient information</p>
        <Button asChild className="mt-4">
          <Link href="/patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients List
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
          Back to Patient Details
        </Button>
        <PatientForm 
          isEditing 
          patientId={patient.patientId}
          defaultValues={patient} 
          onSuccess={handleEditSuccess} 
        />
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-4">
        <Link href="/patients">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients List
        </Link>
      </Button>

      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=random`} />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-heading font-bold text-neutral-800">{patient.name}</h1>
              <div className="flex items-center mt-1">
                <Badge variant="outline">{patient.patientId}</Badge>
                {patient.bloodType && (
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-800 border-red-200">
                    {patient.bloodType}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleScheduleAppointment}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button onClick={handleEditPatient}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Patient
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
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
                      <p className="font-medium">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Date of Birth</p>
                      <p className="font-medium">{patient.dateOfBirth || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Gender</p>
                      <p className="font-medium">{patient.gender || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Blood Type</p>
                      <p className="font-medium">{patient.bloodType || "—"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-neutral-500">Address</p>
                      <p className="font-medium">{patient.address || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Phone</p>
                      <p className="font-medium">{patient.phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="font-medium">{patient.email || "—"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-neutral-500">Emergency Contact</p>
                      <p className="font-medium">{patient.emergencyContact || "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Medical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm text-neutral-500">Allergies</p>
                    <p className="font-medium">{patient.allergies || "No known allergies"}</p>
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
                  <Button variant="outline" className="w-full justify-start" onClick={handleScheduleAppointment}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab("medical-records");
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Medical Records
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab("billing");
                    }}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Billing Information
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full justify-start">
                    <Clipboard className="mr-2 h-4 w-4" />
                    Print Patient Summary
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDeletePatient}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Patient
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm font-medium">Appointment Scheduled</p>
                    <p className="text-xs text-neutral-500">Today, 10:30 AM</p>
                  </div>
                  <div className="border-l-2 border-info pl-4">
                    <p className="text-sm font-medium">Medical Record Updated</p>
                    <p className="text-xs text-neutral-500">Yesterday, 2:15 PM</p>
                  </div>
                  <div className="border-l-2 border-warning pl-4">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-neutral-500">Oct 12, 11:45 AM</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full" onClick={() => setActiveTab("appointments")}>
                    View All Activity
                    <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          {showAppointmentForm ? (
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAppointmentForm(false)} 
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Appointments
              </Button>
              <AppointmentForm 
                defaultValues={{ patientId: patient.patientId }} 
                onSuccess={handleAppointmentSuccess} 
              />
            </div>
          ) : (
            <AppointmentsList patientId={patient.patientId} />
          )}
        </TabsContent>
        
        <TabsContent value="medical-records">
          <RecordsList patientId={patient.patientId} />
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingList patientId={patient.patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
