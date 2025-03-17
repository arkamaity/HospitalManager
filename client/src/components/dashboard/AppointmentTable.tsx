import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment } from "@shared/schema";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface AppointmentWithDetails extends Appointment {
  patientName?: string;
  patientImage?: string;
  doctorName?: string;
  department?: string;
}

const AppointmentTable = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: appointments, isLoading, error } = useQuery<AppointmentWithDetails[]>({
    queryKey: ['/api/appointments', { date: today }],
  });

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-neutral-200">
        <CardTitle className="font-heading font-bold text-neutral-800">Today's Appointments</CardTitle>
        <Link href="/appointments">
          <Button variant="link" className="text-primary text-sm font-medium">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-destructive">
              Failed to load appointments
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-neutral-100">
                <TableRow>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patient</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Time</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Doctor</TableHead>
                  <TableHead className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-neutral-200">
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 rounded-full">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="Patient photo" />
                            <AvatarFallback>{appointment.patientId.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-neutral-900">Emma Wilson</div>
                            <div className="text-xs text-neutral-500">{appointment.patientId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">{appointment.time}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">Dr. Michael Brown</div>
                        <div className="text-xs text-neutral-500">Cardiology</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Link href={`/appointments/${appointment.appointmentId}`}>
                          <Button variant="link" className="text-primary hover:text-primary-dark font-medium">Details</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-6 text-center text-neutral-500">
                      No appointments scheduled for today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <div className="px-4 py-3 bg-white border-t border-neutral-200 text-right">
            <Link href="/appointments">
              <Button variant="link" className="font-medium text-sm text-primary hover:text-primary-dark">
                View All Appointments →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentTable;
