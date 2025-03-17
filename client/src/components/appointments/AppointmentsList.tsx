import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Calendar,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { Appointment, Patient, Doctor } from "@shared/schema";

interface AppointmentWithDetails extends Appointment {
  patientName?: string;
  doctorName?: string;
  department?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AppointmentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch appointments with date filter
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useQuery<Appointment[]>({
    queryKey: ['/api/appointments', { date: dateFilter }],
  });

  // Get patients and doctors for name lookups
  const { data: patients } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

  // Combine appointment data with patient and doctor names
  const appointmentsWithDetails: AppointmentWithDetails[] = appointments?.map(appointment => {
    const patient = patients?.find(p => p.patientId === appointment.patientId);
    const doctor = doctors?.find(d => d.doctorId === appointment.doctorId);
    
    return {
      ...appointment,
      patientName: patient?.name,
      doctorName: doctor?.name,
      department: doctor?.department
    };
  }) || [];

  // Apply search and status filters
  const filteredAppointments = appointmentsWithDetails.filter(appointment => {
    const matchesSearch = 
      (appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       appointment.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       appointment.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       appointment.time.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter ? appointment.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-heading">Appointments</CardTitle>
          <Link href="/appointments/new">
            <Button className="mt-2 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2 items-center">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <Input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="flex-1"
            />
          </div>
          
          <div className="flex space-x-2 items-center">
            <Filter className="h-4 w-4 text-neutral-400" />
            <Select onValueChange={handleStatusChange} defaultValue="all">
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {appointmentsLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : appointmentsError ? (
          <div className="text-center py-4 text-destructive">
            An error occurred while loading appointments.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      {searchQuery || statusFilter ? "No appointments matching your filters." : "No appointments scheduled for this date."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell className="font-medium">
                        <Link href={`/appointments/${appointment.appointmentId}`}>
                          <a className="text-primary hover:underline font-medium">
                            {appointment.appointmentId}
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>{appointment.patientName || appointment.patientId}</TableCell>
                      <TableCell>
                        <div>{appointment.doctorName || appointment.doctorId}</div>
                        {appointment.department && (
                          <div className="text-xs text-neutral-500">{appointment.department}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{appointment.date}</div>
                        <div className="text-xs text-neutral-500">{appointment.time}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/appointments/${appointment.appointmentId}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/appointments/${appointment.appointmentId}/edit`}>
                              <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Cancel Appointment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;
