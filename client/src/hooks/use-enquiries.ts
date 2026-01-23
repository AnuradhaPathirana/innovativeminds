import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type EnquiryInput, type EnquiryResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useEnquiries() {
  return useQuery({
    queryKey: [api.enquiries.list.path],
    queryFn: async () => {
      const res = await fetch(api.enquiries.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch enquiries");
      }
      return api.enquiries.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEnquiry() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: EnquiryInput) => {
      const res = await fetch(api.enquiries.create.path, {
        method: api.enquiries.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit enquiry");
      }
      
      return api.enquiries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Enquiry Submitted!",
        description: "We'll get back to you shortly.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateEnquiryStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "pending" | "contacted" }) => {
      const url = buildUrl(api.enquiries.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.enquiries.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.enquiries.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.enquiries.list.path] });
      toast({
        title: "Status Updated",
        description: "Enquiry status has been changed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
