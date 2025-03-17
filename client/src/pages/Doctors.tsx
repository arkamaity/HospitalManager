import { useState } from "react";
import { useLocation } from "wouter";
import DoctorsList from "@/components/doctors/DoctorsList";
import DoctorForm from "@/components/doctors/DoctorForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";

const Doctors = () => {
  const [location, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const handleAddDoctor = () => {
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
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Doctors & Staff</h1>
          <p className="text-neutral-500">Manage doctors and hospital staff information</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddDoctor} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add New Doctor
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
            Back to Doctors List
          </Button>
          <DoctorForm onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <DoctorsList />
      )}

      {!showForm && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Cardiology</p>
                  <p className="text-2xl font-bold text-primary">5 Doctors</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Neurology</p>
                  <p className="text-2xl font-bold text-green-600">3 Doctors</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Orthopedics</p>
                  <p className="text-2xl font-bold text-purple-600">4 Doctors</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">General</p>
                  <p className="text-2xl font-bold text-amber-600">7 Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Doctors;
