import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertCircle, XCircle, CreditCard } from "lucide-react";
import type { Billing } from "@shared/schema";

const getBillingIcon = (description: string) => {
  if (description.toLowerCase().includes('processed') || 
      description.toLowerCase().includes('paid')) {
    return {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    };
  } else if (description.toLowerCase().includes('pending')) {
    return {
      icon: AlertCircle,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    };
  } else if (description.toLowerCase().includes('rejected') || 
             description.toLowerCase().includes('declined')) {
    return {
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    };
  } else {
    return {
      icon: CreditCard,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    };
  }
};

const getAmountColor = (description: string) => {
  if (description.toLowerCase().includes('processed') || 
      description.toLowerCase().includes('paid')) {
    return 'text-green-600';
  } else if (description.toLowerCase().includes('pending')) {
    return 'text-orange-600';
  } else if (description.toLowerCase().includes('rejected') || 
             description.toLowerCase().includes('declined')) {
    return 'text-red-600';
  } else {
    return 'text-blue-600';
  }
};

interface BillingWithDetails extends Billing {
  patientName?: string;
  timeFormatted?: string;
}

const BillingActivity = () => {
  const { data: billings, isLoading, error } = useQuery<BillingWithDetails[]>({
    queryKey: ['/api/billings'],
  });

  const recentBillings = billings ? billings.slice(0, 4) : [];
  
  // Add some mock patient names for display
  const patientNames = ["Emma Wilson", "David Lee", "Thomas Wright", "Alice Chen"];
  const times = ["Today, 9:42 AM", "Yesterday, 3:15 PM", "Oct 15, 11:30 AM", "Oct 14, 2:10 PM"];
  
  const billingsWithDetails = recentBillings.map((billing, index) => ({
    ...billing,
    patientName: patientNames[index % patientNames.length],
    timeFormatted: times[index % times.length]
  }));

  return (
    <Card>
      <CardHeader className="px-4 py-3 border-b border-neutral-200">
        <CardTitle className="font-heading font-bold text-neutral-800">Recent Billing Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[180px]" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-[80px] ml-auto" />
                  <Skeleton className="h-3 w-[100px] ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">
            Failed to load billing activity
          </div>
        ) : billingsWithDetails.length > 0 ? (
          <div className="space-y-4">
            {billingsWithDetails.map((billing) => {
              const { icon: Icon, bgColor, textColor } = getBillingIcon(billing.description);
              const amountColor = getAmountColor(billing.description);
              
              return (
                <div key={billing.billingId} className="flex items-center p-2 hover:bg-neutral-50 rounded-lg">
                  <div className={`p-2 rounded-full ${bgColor} mr-4`}>
                    <Icon className={`h-5 w-5 ${textColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{billing.description}</p>
                    <p className="text-xs text-neutral-500">Patient: {billing.patientName} • #{billing.billingId}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${amountColor}`}>
                      {billing.description.toLowerCase().includes('claim rejected') ? '-' : '+'}${billing.amount}
                    </p>
                    <p className="text-xs text-neutral-500">{billing.timeFormatted}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-neutral-500">
            No billing activity found
          </div>
        )}
        <div className="text-center mt-6">
          <Link href="/billing">
            <Button variant="outline" className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white text-sm font-medium transition duration-150">
              View All Transactions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingActivity;
