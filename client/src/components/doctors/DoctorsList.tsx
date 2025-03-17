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
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@shared/schema";

const DoctorsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: doctors, isLoading, error } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

  const filteredDoctors = doctors
    ? doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.doctorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (doctor.department && doctor.department.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 p-4 md:p-6">
        <CardTitle className="text-xl font-heading">Doctors & Staff</CardTitle>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search doctors..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/doctors/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
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
            An error occurred while loading doctors.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Doctor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Specialization</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                      {searchQuery ? "No doctors found matching your search." : "No doctors registered yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.doctorId}>
                      <TableCell className="font-medium">
                        <Link href={`/doctors/${doctor.doctorId}`}>
                          <a className="text-primary hover:underline font-medium">
                            {doctor.doctorId}
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>{doctor.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {doctor.specialization}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {doctor.department || "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {doctor.phone || doctor.email || "—"}
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
                            <Link href={`/doctors/${doctor.doctorId}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/doctors/${doctor.doctorId}/edit`}>
                              <DropdownMenuItem>Edit Information</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                            <DropdownMenuItem>Manage Appointments</DropdownMenuItem>
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

export default DoctorsList;
