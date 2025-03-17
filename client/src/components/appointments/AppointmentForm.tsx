import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertAppointmentSchema, appointmentStatusSchema } from "@shared/schema";
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
import type { Patient, Doctor } from "@shared/schema";

// Extend the appointment schema with required validations
const formSchema = insertAppointmentSchema.extend({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: appointmentStatusSchema,
});

type AppointmentFormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<AppointmentFormValues>;
  isEditing?: boolean;
  appointmentId?: string;
}

const AppointmentForm = ({
  onSuccess,
  defaultValues = {},
  isEditing = false,
  appointmentId,
}: AppointmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch patients for dropdown
  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  // Fetch doctors for dropdown
  const { data: doctors, isLoading: doctorsLoading } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: new Date().toISOString().split('T')[0],
      time: "",
      status: "scheduled",
      notes: "",
      ...defaultValues,
    },
  });

  // Load appointment data if editing
  useEffect(() => {
    if (isEditing && appointmentId) {
      const loadAppointment = async () => {
        try {
          const response = await fetch(`/api/appointments/${appointmentId}`, {
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error("Failed to load appointment data");
          }
          
          const data = await response.json();
          // Set form values
          Object.keys(data).forEach((key) => {
            if (form.getValues()[key as keyof AppointmentFormValues] !== undefined) {
              form.setValue(key as keyof AppointmentFormValues, data[key]);
            }
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load appointment data",
            variant: "destructive",
          });
        }
      };
      
      loadAppointment();
    }
  }, [isEditing, appointmentId, form, toast]);

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormValues) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: "Success",
        description: "Appointment has been scheduled successfully",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule appointment",
        variant: "destructive",
      });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormValues) => {
      const response = await apiRequest("PUT", `/api/appointments/${appointmentId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      if (appointmentId) {
        queryClient.invalidateQueries({ queryKey: [`/api/appointments/${appointmentId}`] });
      }
      toast({
        title: "Success",
        description: "Appointment has been updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && appointmentId) {
        await updateAppointmentMutation.mutateAsync(data);
      } else {
        await createAppointmentMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = patientsLoading || doctorsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Appointment" : "Schedule New Appointment"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {isLoading ? (
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
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors?.map((doctor) => (
                            <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                              {doctor.name} ({doctor.specialization})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="checking-in">Checking In</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No Show</SelectItem>
                          <SelectItem value="waiting">Waiting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any relevant notes about this appointment"
                          className="min-h-[120px]"
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
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AppointmentForm;
