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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { MedicalRecord, Patient, Doctor } from "@shared/schema";

interface RecordWithDetails extends MedicalRecord {
  patientName?: string;
  doctorName?: string;
}

const RecordsList = ({ patientId }: { patientId?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Query param to filter by patient if provided
  const queryParams = patientId ? { patientId } : undefined;
  
  // Fetch records
  const { data: records, isLoading: recordsLoading, error: recordsError } = useQuery<MedicalRecord[]>({
    queryKey: ['/api/records', queryParams],
  });

  // Get patients and doctors for name lookups
  const { data: patients } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  const { data: doctors } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

  // Combine record data with patient and doctor names
  const recordsWithDetails: RecordWithDetails[] = records?.map(record => {
    const patient = patients?.find(p => p.patientId === record.patientId);
    const doctor = doctors?.find(d => d.doctorId === record.doctorId);
    
    return {
      ...record,
      patientName: patient?.name,
      doctorName: doctor?.name
    };
  }) || [];

  // Apply search filter
  const filteredRecords = recordsWithDetails.filter(record => {
    return (
      record.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      record.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 p-4 md:p-6">
        <CardTitle className="text-xl font-heading">Medical Records</CardTitle>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/records/new">
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Record
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recordsLoading ? (
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
        ) : recordsError ? (
          <div className="text-center py-4 text-destructive">
            An error occurred while loading medical records.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  {!patientId && <TableHead>Patient</TableHead>}
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={patientId ? 5 : 6} className="text-center py-8 text-neutral-500">
                      {searchQuery ? "No records matching your search." : "No medical records found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.recordId}>
                      <TableCell className="font-medium">
                        <Link href={`/records/${record.recordId}`}>
                          <a className="text-primary hover:underline font-medium">
                            {record.recordId}
                          </a>
                        </Link>
                      </TableCell>
                      {!patientId && (
                        <TableCell>{record.patientName || record.patientId}</TableCell>
                      )}
                      <TableCell>{record.doctorName || record.doctorId}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.diagnosis || "—"}
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
                            <Link href={`/records/${record.recordId}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/records/${record.recordId}/edit`}>
                              <DropdownMenuItem>Edit Record</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Print Record</DropdownMenuItem>
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

export default RecordsList;
