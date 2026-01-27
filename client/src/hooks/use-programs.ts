import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Program {
    id: number;
    title: string;
    description: string;
    icon: string;
    image: string | null;
    features: string[];
    duration: string | null;
    delivery_mode: "Online" | "Virtual" | "Online & Virtual" | null;
    for_whom: string[] | null;
    price: number | null;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProgramInput {
    title: string;
    description: string;
    icon: string;
    image?: string;
    features: string[];
    duration?: string;
    delivery_mode?: "Online" | "Virtual" | "Online & Virtual";
    for_whom?: string[];
    price?: number;
    display_order?: number;
}

async function fetchPrograms(): Promise<Program[]> {
    const response = await fetch("/api/programs");
    if (!response.ok) throw new Error("Failed to fetch programs");
    return response.json();
}

async function createProgram(data: CreateProgramInput): Promise<Program> {
    const response = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create program");
    return response.json();
}

async function updateProgram({ id, ...data }: CreateProgramInput & { id: number }): Promise<Program> {
    const response = await fetch(`/api/admin/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update program");
    return response.json();
}

async function deleteProgram(id: number): Promise<void> {
    const response = await fetch(`/api/admin/programs/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete program");
}

export function usePrograms() {
    return useQuery<Program[]>({
        queryKey: ["/api/programs"],
        queryFn: fetchPrograms,
        staleTime: 1000 * 60 * 5,
    });
}

async function fetchPopularPrograms(): Promise<(Program & { enquiryCount: number })[]> {
    const response = await fetch("/api/programs/popular?limit=5");
    if (!response.ok) throw new Error("Failed to fetch popular programs");
    return response.json();
}

export function usePopularPrograms() {
    return useQuery<(Program & { enquiryCount: number })[]>({
        queryKey: ["/api/programs/popular"],
        queryFn: fetchPopularPrograms,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
        },
    });
}

export function useUpdateProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
        },
    });
}

export function useDeleteProgram() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/programs"] });
        },
    });
}
