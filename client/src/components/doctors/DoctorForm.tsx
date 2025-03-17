import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertDoctorSchema } from "@shared/schema";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Extend the doctor schema with required validations
const formSchema = insertDoctorSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
});

type DoctorFormValues = z.infer<typeof formSchema>;

interface DoctorFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<DoctorFormValues>;
  isEditing?: boolean;
  doctorId?: string;
}

const DoctorForm = ({ 
  onSuccess, 
  defaultValues = {}, 
  isEditing = false,
  doctorId 
}: DoctorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialization: "",
      email: "",
      phone: "",
      department: "",
      ...defaultValues
    }
  });

  const createDoctorMutation = useMutation({
    mutationFn: async (data: DoctorFormValues) => {
      const response = await apiRequest("POST", "/api/doctors", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      toast({
        title: "Success",
        description: "Doctor has been created successfully",
      });
      if (onSuccess) onSuccess();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create doctor",
        variant: "destructive",
      });
    },
  });

  const updateDoctorMutation = useMutation({
    mutationFn: async (data: DoctorFormValues) => {
      const response = await apiRequest("PUT", `/api/doctors/${doctorId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doctors'] });
      queryClient.invalidateQueries({ queryKey: [`/api/doctors/${doctorId}`] });
      toast({
        title: "Success",
        description: "Doctor has been updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update doctor",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && doctorId) {
        await updateDoctorMutation.mutateAsync(data);
      } else {
        await createDoctorMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Doctor" : "Register New Doctor"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter doctor's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cardiology, Neurology, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Doctor" : "Register Doctor"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DoctorForm;
