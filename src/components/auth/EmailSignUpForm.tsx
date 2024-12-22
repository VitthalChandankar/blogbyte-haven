import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface EmailSignUpFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const EmailSignUpForm = ({ isLoading, setIsLoading }: EmailSignUpFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (values: FormData) => {
    console.log("Starting sign up process...");
    setIsLoading(true);
    
    try {
      console.log("Attempting to sign up with email:", values.email);

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: values.email,
          }
        },
      });

      console.log("Sign up response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        let errorMessage = "An unexpected error occurred. Please try again.";
        
        if (error.message.includes("Database error")) {
          errorMessage = "There was an issue creating your account. Please try again later.";
        } else if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Please sign in instead.";
        }
        
        throw new Error(errorMessage);
      }

      if (data?.user) {
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your registration.",
        });
        navigate("/signin");
      } else {
        throw new Error("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error signing up",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4">
          <Button type="submit" disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Creating account..." : "Sign up with Email"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/signin")}
            disabled={isLoading}
          >
            Already have an account? Sign in
          </Button>
        </div>
      </form>
    </Form>
  );
};