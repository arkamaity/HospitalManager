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
import { Search, Plus, MoreHorizontal, Calendar, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { Billing, Patient } from "@shared/schema";

interface BillingWithDetails extends Billing {
  patientName?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'partially-paid':
      return 'bg-blue-100 text-blue-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BillingList = ({ patientId }: { patientId?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Query param to filter by patient if provided
  const queryParams = patientId ? { patientId } : undefined;
  
  // Fetch billings
  const { data: billings, isLoading: billingsLoading, error: billingsError } = useQuery<Billing[]>({
    queryKey: ['/api/billings', queryParams],
  });

  // Get patients for name lookups
  const { data: patients } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
  });

  // Combine billing data with patient names
  const billingsWithDetails: BillingWithDetails[] = billings?.map(billing => {
    const patient = patients?.find(p => p.patientId === billing.patientId);
    
    return {
      ...billing,
      patientName: patient?.name
    };
  }) || [];

  // Apply search and status filters
  const filteredBillings = billingsWithDetails.filter(billing => {
    const matchesSearch = 
      (billing.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       billing.billingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
       billing.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter ? billing.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  // Calculate total amount
  const totalAmount = filteredBillings.reduce((total, billing) => {
    return total + parseFloat(billing.amount.toString());
  }, 0);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-heading">Billing Records</CardTitle>
          <Link href="/billing/new">
            <Button className="mt-2 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              New Billing
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search billings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partially-paid">Partially Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!patientId && filteredBillings.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-500">Total Amount: <span className="font-bold text-neutral-800">${totalAmount.toFixed(2)}</span></p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {billingsLoading ? (
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
        ) : billingsError ? (
          <div className="text-center py-4 text-destructive">
            An error occurred while loading billing records.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Billing ID</TableHead>
                  {!patientId && <TableHead>Patient</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBillings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={patientId ? 6 : 7} className="text-center py-8 text-neutral-500">
                      {searchQuery || statusFilter ? "No billing records matching your filters." : "No billing records found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBillings.map((billing) => (
                    <TableRow key={billing.billingId}>
                      <TableCell className="font-medium">
                        <Link href={`/billing/${billing.billingId}`}>
                          <a className="text-primary hover:underline font-medium">
                            {billing.billingId}
                          </a>
                        </Link>
                      </TableCell>
                      {!patientId && (
                        <TableCell>{billing.patientName || billing.patientId}</TableCell>
                      )}
                      <TableCell>{billing.date}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {billing.description}
                      </TableCell>
                      <TableCell>${parseFloat(billing.amount.toString()).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(billing.status)}`}>
                          {billing.status}
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
                            <Link href={`/billing/${billing.billingId}`}>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </Link>
                            <Link href={`/billing/${billing.billingId}/edit`}>
                              <DropdownMenuItem>Edit Billing</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
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

export default BillingList;
