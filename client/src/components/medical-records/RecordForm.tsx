import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertMedicalRecordSchema } from "@shared/schema";
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

// Extend the medical record schema with required validations
const formSchema = insertMedicalRecordSchema.extend({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
});

type RecordFormValues = z.infer<typeof formSchema>;

interface RecordFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<RecordFormValues>;
  isEditing?: boolean;
  recordId?: string;
}

const RecordForm = ({
  onSuccess,
  defaultValues = {},
  isEditing = false,
  recordId,
}: RecordFormProps) => {
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

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      date: new Date().toISOString().split('T')[0],
      diagnosis: "",
      treatment: "",
      medications: "",
      notes: "",
      ...defaultValues,
    },
  });

  // Load record data if editing
  useEffect(() => {
    if (isEditing && recordId) {
      const loadRecord = async () => {
        try {
          const response = await fetch(`/api/records/${recordId}`, {
            credentials: "include",
          });
          
          if (!response.ok) {
            throw new Error("Failed to load medical record data");
          }
          
          const data = await response.json();
          // Set form values
          Object.keys(data).forEach((key) => {
            if (form.getValues()[key as keyof RecordFormValues] !== undefined) {
              form.setValue(key as keyof RecordFormValues, data[key]);
            }
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load medical record data",
            variant: "destructive",
          });
        }
      };
      
      loadRecord();
    }
  }, [isEditing, recordId, form, toast]);

  const createRecordMutation = useMutation({
    mutationFn: async (data: RecordFormValues) => {
      const response = await apiRequest("POST", "/api/records", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      toast({
        title: "Success",
        description: "Medical record has been created successfully",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create medical record",
        variant: "destructive",
      });
    },
  });

  const updateRecordMutation = useMutation({
    mutationFn: async (data: RecordFormValues) => {
      const response = await apiRequest("PUT", `/api/records/${recordId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      if (recordId) {
        queryClient.invalidateQueries({ queryKey: [`/api/records/${recordId}`] });
      }
      toast({
        title: "Success",
        description: "Medical record has been updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update medical record",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: RecordFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && recordId) {
        await updateRecordMutation.mutateAsync(data);
      } else {
        await createRecordMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = patientsLoading || doctorsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Medical Record" : "Create New Medical Record"}</CardTitle>
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
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter diagnosis details"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter treatment details"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter prescribed medications"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes"
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
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Record" : "Create Record"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RecordForm;
