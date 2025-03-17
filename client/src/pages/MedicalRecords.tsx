import { useState } from "react";
import { useLocation } from "wouter";
import RecordsList from "@/components/medical-records/RecordsList";
import RecordForm from "@/components/medical-records/RecordForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";

const MedicalRecords = () => {
  const [location, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const handleAddRecord = () => {
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
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Medical Records</h1>
          <p className="text-neutral-500">Manage patient medical records and history</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddRecord} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create New Record
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
            Back to Records List
          </Button>
          <RecordForm onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <>
          <RecordsList />
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Records Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Total Records</p>
                    <p className="text-2xl font-bold text-primary">487</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Created Today</p>
                    <p className="text-2xl font-bold text-green-600">12</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Updated Today</p>
                    <p className="text-2xl font-bold text-yellow-600">18</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-500">Pending Reviews</p>
                    <p className="text-2xl font-bold text-purple-600">5</p>
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

export default MedicalRecords;
