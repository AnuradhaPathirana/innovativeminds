import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useEnquiries, useUpdateEnquiryStatus } from "@/hooks/use-enquiries";
import { AdminLayout } from "@/components/AdminLayout";
import { Loader2, CheckCircle, Clock, Search, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";

export default function InquiriesPage() {
    const { user, isLoading: authLoading, isAuthenticated } = useAdminAuth();
    const { data: enquiries, isLoading: enquiriesLoading, error } = useEnquiries();
    const updateStatus = useUpdateEnquiryStatus();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "contacted">("all");
    const [, setLocation] = useLocation();

    // Auth Loading
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not Authenticated - Redirect to login
    if (!isAuthenticated) {
        setLocation("/admin");
        return null;
    }

    // Filter enquiries
    const filteredEnquiries = enquiries?.filter(e => {
        const matchesSearch =
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.email.toLowerCase().includes(search.toLowerCase()) ||
            e.program.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "all" || e.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: enquiries?.length || 0,
        pending: enquiries?.filter(e => e.status === "pending").length || 0,
        contacted: enquiries?.filter(e => e.status === "contacted").length || 0,
    };

    return (
        <AdminLayout>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Inquiries</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                    </div>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Contacted</p>
                            <p className="text-3xl font-bold text-green-400">{stats.contacted}</p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, email, or program..."
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {(["all", "pending", "contacted"] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className={statusFilter === status
                                ? "bg-primary"
                                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                            }
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Inquiries List */}
            {enquiriesLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">
                    Failed to load inquiries. Please try again.
                </div>
            ) : filteredEnquiries?.length === 0 ? (
                <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No inquiries found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredEnquiries?.map((enquiry) => (
                        <Card key={enquiry.id} className="bg-slate-800 border-slate-700 p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-bold text-lg">
                                                {enquiry.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-white font-semibold">{enquiry.name}</h3>
                                                <Badge
                                                    className={enquiry.status === "contacted"
                                                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/20"
                                                        : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                                                    }
                                                >
                                                    {enquiry.status === "contacted" ? (
                                                        <><CheckCircle className="w-3 h-3 mr-1" /> Contacted</>
                                                    ) : (
                                                        <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                                    )}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {enquiry.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {enquiry.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {enquiry.createdAt && format(new Date(enquiry.createdAt), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-primary text-sm font-medium">{enquiry.program}</p>
                                                {enquiry.message && (
                                                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{enquiry.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 lg:flex-shrink-0">
                                    <Button
                                        size="sm"
                                        variant={enquiry.status === "pending" ? "default" : "outline"}
                                        disabled={updateStatus.isPending}
                                        onClick={() => updateStatus.mutate({
                                            id: enquiry.id,
                                            status: enquiry.status === "pending" ? "contacted" : "pending"
                                        })}
                                        className={enquiry.status === "pending"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "border-slate-600 text-slate-300"
                                        }
                                    >
                                        {enquiry.status === "pending" ? "Mark Contacted" : "Mark Pending"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
