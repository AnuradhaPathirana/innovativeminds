import { useAdminAuth } from "@/hooks/use-admin-auth";
import { usePrograms, useCreateProgram, useUpdateProgram, useDeleteProgram, Program, CreateProgramInput } from "@/hooks/use-programs";
import { AdminLayout } from "@/components/AdminLayout";
import {
    Loader2, Plus, Pencil, Trash2, GraduationCap, X, Save, ImageIcon,
    Laptop, Briefcase, Bot, ShoppingCart, Globe, FileSpreadsheet, Lightbulb, Rocket, Award, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const ICONS = [
    { name: "Laptop", icon: Laptop },
    { name: "Briefcase", icon: Briefcase },
    { name: "Bot", icon: Bot },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Globe", icon: Globe },
    { name: "FileSpreadsheet", icon: FileSpreadsheet },
    { name: "Lightbulb", icon: Lightbulb },
    { name: "Rocket", icon: Rocket },
    { name: "Award", icon: Award },
    { name: "Users", icon: Users },
    { name: "GraduationCap", icon: GraduationCap },
];

const iconMap: Record<string, any> = Object.fromEntries(
    ICONS.map(i => [i.name, i.icon])
);

interface ModuleFormData {
    title: string;
    description: string;
    icon: string;
    image: string;
    features: string;
    duration: string;
    delivery_mode: "Online" | "Virtual" | "Online & Virtual";
    for_whom: string;
    display_order: number;
}

const emptyForm: ModuleFormData = {
    title: "",
    description: "",
    icon: "Laptop",
    image: "",
    features: "",
    duration: "",
    delivery_mode: "Online",
    for_whom: "",
    display_order: 0,
};

export default function ModulesPage() {
    const { isLoading: authLoading, isAuthenticated } = useAdminAuth();
    const { data: programs, isLoading: programsLoading, error } = usePrograms();
    const createProgram = useCreateProgram();
    const updateProgram = useUpdateProgram();
    const deleteProgram = useDeleteProgram();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
    const [formData, setFormData] = useState<ModuleFormData>(emptyForm);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>("");

    // Auth Loading
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not Authenticated
    if (!isAuthenticated) {
        setLocation("/admin");
        return null;
    }

    const openCreateDialog = () => {
        setEditingProgram(null);
        setFormData(emptyForm);
        setSelectedFile(null);
        setImagePreview("");
        setIsDialogOpen(true);
    };

    const openEditDialog = (program: Program) => {
        setEditingProgram(program);
        setFormData({
            title: program.title,
            description: program.description,
            icon: program.icon,
            image: program.image || "",
            features: Array.isArray(program.features) ? program.features.join(", ") : "",
            duration: program.duration || "",
            delivery_mode: program.delivery_mode || "Online",
            for_whom: Array.isArray(program.for_whom) ? program.for_whom.join(", ") : "",
            display_order: program.display_order,
        });
        setSelectedFile(null);
        setImagePreview(program.image || "");
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (program: Program) => {
        setDeletingProgram(program);
        setIsDeleteDialogOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
                return;
            }
            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast({ title: "Error", description: "Image size must be less than 10MB", variant: "destructive" });
                return;
            }
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = formData.image;

            // Upload image if a new file is selected
            if (selectedFile) {
                setIsUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append('image', selectedFile);

                const uploadResponse = await fetch('/api/admin/upload/program-image', {
                    method: 'POST',
                    credentials: 'include',
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.imageUrl;
                setIsUploading(false);
            }

            const featuresArray = formData.features
                .split(",")
                .map(f => f.trim())
                .filter(f => f.length > 0);

            const forWhomArray = formData.for_whom
                .split(",")
                .map(f => f.trim())
                .filter(f => f.length > 0);

            const data: CreateProgramInput = {
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
                image: imageUrl || undefined,
                features: featuresArray,
                duration: formData.duration || undefined,
                delivery_mode: formData.delivery_mode,
                for_whom: forWhomArray.length > 0 ? forWhomArray : undefined,
                display_order: formData.display_order,
            };

            if (editingProgram) {
                await updateProgram.mutateAsync({ id: editingProgram.id, ...data });
                toast({ title: "Success", description: "Module updated successfully" });
            } else {
                await createProgram.mutateAsync(data);
                toast({ title: "Success", description: "Module created successfully" });
            }
            setIsDialogOpen(false);
            setFormData(emptyForm);
            setSelectedFile(null);
            setImagePreview("");
        } catch (err) {
            setIsUploading(false);
            toast({ title: "Error", description: "Failed to save module", variant: "destructive" });
        }
    };

    const handleDelete = async () => {
        if (!deletingProgram) return;

        try {
            await deleteProgram.mutateAsync(deletingProgram.id);
            toast({ title: "Success", description: "Module deleted successfully" });
            setIsDeleteDialogOpen(false);
            setDeletingProgram(null);
        } catch (err) {
            toast({ title: "Error", description: "Failed to delete module", variant: "destructive" });
        }
    };

    const IconComponent = (iconName: string) => {
        const Icon = iconMap[iconName] || Laptop;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Course Modules</h2>
                    <p className="text-slate-400 text-sm">Manage your training programs and courses</p>
                </div>
                <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Module
                </Button>
            </div>

            {/* Modules Grid */}
            {programsLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">
                    Failed to load modules. Please try again.
                </div>
            ) : programs?.length === 0 ? (
                <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No modules found</p>
                    <Button onClick={openCreateDialog} variant="outline" className="border-slate-600">
                        Create your first module
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programs?.map((program) => (
                        <Card key={program.id} className="bg-slate-800 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
                            {/* Image Preview */}
                            {program.image && (
                                <div className="relative h-32 overflow-hidden bg-slate-900">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent" />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        {IconComponent(program.icon)}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                                            onClick={() => openEditDialog(program)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                            onClick={() => openDeleteDialog(program)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-white font-semibold mb-2 line-clamp-2">{program.title}</h3>
                                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{program.description}</p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {program.features?.slice(0, 3).map((feature, i) => (
                                        <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                    {program.features?.length > 3 && (
                                        <Badge variant="secondary" className="bg-slate-700 text-slate-400 text-xs">
                                            +{program.features.length - 3} more
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    {program.duration && <span>Duration: {program.duration}</span>}
                                    <span>Order: {program.display_order}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingProgram ? "Edit Module" : "Create New Module"}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {editingProgram ? "Update the module details below" : "Fill in the details to create a new module"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-900 border-slate-700 text-white"
                                placeholder="e.g., Virtual Assistant Training"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-slate-900 border-slate-700 text-white min-h-[80px]"
                                placeholder="Describe the module..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Icon</label>
                                <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {ICONS.map((icon) => (
                                            <SelectItem key={icon.name} value={icon.name} className="text-white">
                                                <div className="flex items-center gap-2">
                                                    <icon.icon className="w-4 h-4" />
                                                    {icon.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Duration</label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    className="bg-slate-900 border-slate-700 text-white"
                                    placeholder="e.g., 3 months"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Delivery Mode</label>
                            <Select value={formData.delivery_mode} onValueChange={(v: "Online" | "Virtual" | "Online & Virtual") => setFormData({ ...formData, delivery_mode: v })}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="Online" className="text-white">Online</SelectItem>
                                    <SelectItem value="Virtual" className="text-white">Virtual</SelectItem>
                                    <SelectItem value="Online & Virtual" className="text-white">Online & Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Features (comma separated)</label>
                            <Input
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                className="bg-slate-900 border-slate-700 text-white"
                                placeholder="Feature 1, Feature 2, Feature 3"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">For Whom (comma separated)</label>
                            <Input
                                value={formData.for_whom}
                                onChange={(e) => setFormData({ ...formData, for_whom: e.target.value })}
                                className="bg-slate-900 border-slate-700 text-white"
                                placeholder="School Leavers, Undergraduates, Fresh Graduates, Career Switchers"
                            />
                            <p className="text-xs text-slate-500">Target audience for this program</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Program Image</label>
                            <div className="space-y-3">
                                {/* File Input */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="block w-full text-sm text-slate-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary file:text-white
                                            hover:file:bg-primary/90
                                            file:cursor-pointer cursor-pointer
                                            bg-slate-900 border border-slate-700 rounded-md
                                            focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <p className="mt-1 text-xs text-slate-500">
                                        Upload an image (JPEG, PNG, GIF, WebP) - Max 10MB
                                    </p>
                                    <p className="text-xs text-primary/80">
                                        ✨ Images will be automatically resized to 800x450px
                                    </p>
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setImagePreview("");
                                                setFormData({ ...formData, image: "" });
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        {selectedFile && (
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                {selectedFile.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Display Order</label>
                            <Input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                className="bg-slate-900 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createProgram.isPending || updateProgram.isPending || isUploading || !formData.title}
                            className="bg-primary"
                        >
                            {(createProgram.isPending || updateProgram.isPending || isUploading) ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isUploading ? 'Uploading...' : 'Saving...'}</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> {editingProgram ? "Update" : "Create"}</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Module</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you sure you want to delete "{deletingProgram?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleteProgram.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteProgram.isPending ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
                            ) : (
                                <><Trash2 className="w-4 h-4 mr-2" /> Delete</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
