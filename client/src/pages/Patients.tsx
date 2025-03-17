import { useState } from "react";
import { useLocation } from "wouter";
import PatientsList from "@/components/patients/PatientsList";
import PatientForm from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";

const Patients = () => {
  const [location, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const handleAddPatient = () => {
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
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Patients Management</h1>
          <p className="text-neutral-500">Manage patient information and records</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddPatient} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
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
            Back to Patients List
          </Button>
          <PatientForm onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <PatientsList />
      )}

      {!showForm && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Patient Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Total Patients</p>
                  <p className="text-2xl font-bold text-primary">324</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Admitted</p>
                  <p className="text-2xl font-bold text-green-600">137</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-500">Appointments Today</p>
                  <p className="text-2xl font-bold text-purple-600">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Patients;
