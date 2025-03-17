import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertBillingSchema, billingStatusSchema } from "@shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { Patient } from "@shared/schema";

// Extend the billing schema with required validations
const formSchema = insertBillingSchema.extend({
  patientId: z.string().min(1, "Patient is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  status: billingStatusSchema,
});

type BillingFormValues = z.infer<typeof formSchema>;

interface BillingFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<BillingFormValues>;
  isEditing?: boolean;
  billingId?: string;
}

const BillingForm = ({
  onSuccess,
  defaultValues = {},
  isEditing = false,
  billingId,
}: BillingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch patients for dropdown
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      status: "pending",
      paymentMethod: "",
      insuranceInfo: "",
      ...defaultValues,
    },
  });

  // Load billing data if editing
  useEffect(() => {
    if (isEditing && billingId) {
      const loadBilling = async () => {
        try {
          const response = await fetch(`/api/billings/${billingId}`, {
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error("Failed to load billing data");
          }
          
          const data = await response.json();
          // Set form values
          Object.keys(data).forEach((key) => {
            if (form.getValues()[key as keyof BillingFormValues] !== undefined) {
              form.setValue(key as keyof BillingFormValues, data[key]);
            }
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load billing data",
            variant: "destructive",
          });
        }
      };
      
      loadBilling();
    }
  }, [isEditing, billingId, form, toast]);

  const createBillingMutation = useMutation({
    mutationFn: async (data: BillingFormValues) => {
      const response = await apiRequest("POST", "/api/billings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billings'] });
      toast({
        title: "Success",
        description: "Billing record has been created successfully",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create billing record",
        variant: "destructive",
      });
    },
  });

  const updateBillingMutation = useMutation({
    mutationFn: async (data: BillingFormValues) => {
      const response = await apiRequest("PUT", `/api/billings/${billingId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billings'] });
      if (billingId) {
        queryClient.invalidateQueries({ queryKey: [`/api/billings/${billingId}`] });
      }
      toast({
        title: "Success",
        description: "Billing record has been updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update billing record",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BillingFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && billingId) {
        await updateBillingMutation.mutateAsync(data);
      } else {
        await createBillingMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Billing Record" : "Create New Billing Record"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {patientsLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients?.map((patient) => (
                            <SelectItem key={patient.patientId} value={patient.patientId}>
                              {patient.name} ({patient.patientId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description of the charge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partially-paid">Partially Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter insurance details if applicable"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => onSuccess ? onSuccess() : form.reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || patientsLoading}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Billing" : "Create Billing"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BillingForm;
