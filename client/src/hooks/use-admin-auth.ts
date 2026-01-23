import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface AdminUser {
    username: string;
    name: string;
}

async function fetchAdminUser(): Promise<AdminUser | null> {
    const response = await fetch("/api/admin/user", {
        credentials: "include",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response.json();
}

async function logout(): Promise<void> {
    await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
    });
}

export function useAdminAuth() {
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery<AdminUser | null>({
        queryKey: ["/api/admin/user"],
        queryFn: fetchAdminUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(["/api/admin/user"], null);
            window.location.href = "/admin";
        },
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
}
