import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient } from "@shared/schema";

interface RecentPatientDisplay extends Patient {
  room?: string;
  admissionTime?: string;
  condition?: string;
}

const getConditionColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'post-surgery':
      return 'bg-blue-100 text-blue-800';
    case 'critical care':
      return 'bg-red-100 text-red-800';
    case 'stable':
      return 'bg-green-100 text-green-800';
    case 'observation':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RecentPatients = () => {
  const { data: patients, isLoading, error } = useQuery<RecentPatientDisplay[]>({
    queryKey: ['/api/patients'],
  });

  const recentPatients = patients ? patients.slice(0, 4) : [];
  
  // For the sample data, we'll add some mock admission details
  const patientsWithDetails = recentPatients.map((patient, index) => {
    const conditions = ['Post-surgery', 'Critical Care', 'Stable', 'Observation'];
    const rooms = ['Room 405', 'Room 218', 'Room 123', 'Room 302'];
    const times = ['3 hours ago', 'yesterday', '2 days ago', '3 days ago'];
    
    return {
      ...patient,
      room: rooms[index % 4],
      admissionTime: times[index % 4],
      condition: conditions[index % 4],
    };
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
        <CardTitle className="font-heading font-bold text-neutral-800">Recently Admitted</CardTitle>
        <Link href="/patients">
          <Button variant="link" className="text-primary text-sm font-medium">View All</Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              Failed to load recent patients
            </div>
          ) : patientsWithDetails.length > 0 ? (
            patientsWithDetails.map((patient) => (
              <div key={patient.patientId} className="p-4">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956" alt="Patient photo" />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{patient.name}</p>
                    <p className="text-xs text-neutral-500">
                      <span className="font-medium">{patient.room}</span> • Admitted {patient.admissionTime}
                    </p>
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className={`px-2 py-0.5 text-xs rounded-full ${getConditionColor(patient.condition || '')}`}>
                        {patient.condition}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-5 w-5 text-neutral-400 hover:text-neutral-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href={`/patients/${patient.patientId}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                      <DropdownMenuItem>Add Record</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-neutral-500">
              No recently admitted patients
            </div>
          )}
          <div className="p-4 text-center">
            <Link href="/patients">
              <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
                View All Patients
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPatients;
