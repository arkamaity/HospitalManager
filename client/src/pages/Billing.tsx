import { useState } from "react";
import { useLocation } from "wouter";
import BillingList from "@/components/billing/BillingList";
import BillingForm from "@/components/billing/BillingForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, DollarSign, CreditCard, AlertCircle, CheckCircle } from "lucide-react";

const Billing = () => {
  const [location, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const handleAddBilling = () => {
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
          <h1 className="text-2xl font-heading font-bold text-neutral-800">Billing Management</h1>
          <p className="text-neutral-500">Manage patient billing and payment information</p>
        </div>
        {!showForm && (
          <Button onClick={handleAddBilling} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Create New Billing
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
            Back to Billing List
          </Button>
          <BillingForm onSuccess={handleFormSuccess} />
        </div>
      ) : (
        <>
          <BillingList />
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-neutral-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-primary">$45,879</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">+8.2% from last month</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-neutral-500">Pending Payments</p>
                        <p className="text-2xl font-bold text-green-600">$12,350</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">18 invoices pending</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-neutral-500">Overdue</p>
                        <p className="text-2xl font-bold text-yellow-600">$3,420</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-xs text-red-500 mt-2">5 invoices overdue</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-neutral-500">Payments Today</p>
                        <p className="text-2xl font-bold text-purple-600">$1,845</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">7 payments received</p>
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

export default Billing;
