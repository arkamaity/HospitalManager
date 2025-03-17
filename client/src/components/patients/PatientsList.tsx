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
import { Search, ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient } from "@shared/schema";

const PatientsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: patients, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  const filteredPatients = patients
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (patient.phone && patient.phone.includes(searchQuery))
      )
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 p-4 md:p-6">
        <CardTitle className="text-xl font-heading">Patients</CardTitle>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/patients/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
        ) : error ? (
          <div className="text-center py-4 text-destructive">
            An error occurred while loading patients.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                  <TableHead className="hidden lg:table-cell">Blood Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      {searchQuery ? "No patients found matching your search." : "No patients registered yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.patientId}>
                      <TableCell className="font-medium">
                        <Link href={`/patients/${patient.patientId}`}>
                          <a className="text-primary hover:underline font-medium">
                            {patient.patientId}
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.dateOfBirth || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {patient.bloodType ? (
                          <Badge variant="outline">{patient.bloodType}</Badge>
                        ) : "—"}
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
                            <Link href={`/patients/${patient.patientId}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/patients/${patient.patientId}/edit`}>
                              <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                            <DropdownMenuItem>View Medical Records</DropdownMenuItem>
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

export default PatientsList;
