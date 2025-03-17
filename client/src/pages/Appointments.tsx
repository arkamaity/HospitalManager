import { useState } from "react";
import { useLocation } from "wouter";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";

const Appointments = () => {
  const [location, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const handleAddAppointment = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Appointments</h1>
          <p className="text-neutral-500">Schedule and manage patient appointments</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddAppointment} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Appointment
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments List
          </Button>
          <AppointmentForm onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <>
          <AppointmentsList />
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appointment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Today</p>
                    <p className="text-2xl font-bold text-primary">24 Appointments</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">This Week</p>
                    <p className="text-2xl font-bold text-green-600">112 Appointments</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Cancellations</p>
                    <p className="text-2xl font-bold text-yellow-600">3 Today</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Available Slots</p>
                    <p className="text-2xl font-bold text-purple-600">8 Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;
