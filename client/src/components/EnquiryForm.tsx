import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEnquirySchema } from "@shared/schema";
import { useCreateEnquiry } from "@/hooks/use-enquiries";
import { usePrograms } from "@/hooks/use-programs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useEffect } from "react";

const formSchema = insertEnquirySchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(9, "Phone number must be at least 9 digits"),
});

type FormData = z.infer<typeof formSchema>;

interface EnquiryFormProps {
  selectedProgram?: string;
}

export function EnquiryForm({ selectedProgram }: EnquiryFormProps) {
  const mutation = useCreateEnquiry();
  const { data: programs, isLoading: programsLoading } = usePrograms();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: selectedProgram || "",
      message: "",
    },
  });

  // Update form when selectedProgram changes
  useEffect(() => {
    if (selectedProgram) {
      form.setValue("program", selectedProgram);
    }
  }, [selectedProgram, form]);

  function onSubmit(data: FormData) {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <div className="glass-card p-4 md:p-5 rounded-xl w-full max-w-lg mx-auto" id="contact">
      <div className="mb-4">
        <h3 className="text-xl font-display font-bold mb-1">Start Your Journey</h3>
        <p className="text-xs text-muted-foreground">Our admissions team will contact you shortly.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="h-9 text-sm bg-secondary/20 border-border focus:border-primary/50 rounded-lg" />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} className="h-9 text-sm bg-secondary/20 border-border focus:border-primary/50 rounded-lg" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Phone Number <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="+94 7X XXX XXXX" {...field} className="h-9 text-sm bg-secondary/20 border-border focus:border-primary/50 rounded-lg" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">Interested Program</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-9 text-sm bg-secondary/20 border-border focus:border-primary/50 rounded-lg">
                      <SelectValue placeholder={programsLoading ? "Loading..." : "Select a program"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programs && programs.map((program) => (
                      <SelectItem key={program.id} value={program.title} className="text-sm">
                        {program.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="General Enquiry" className="text-sm">
                      General Enquiry
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your goals..."
                    className="min-h-[60px] text-sm bg-secondary/20 border-border focus:border-primary/50 rounded-lg resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-10 rounded-full shadow-md shadow-primary/10 transition-all text-sm mt-2"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Enquiry"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
