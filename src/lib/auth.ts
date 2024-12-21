import { supabase } from "./supabase";
import { NavigateFunction } from "react-router-dom";
import { toast as Toast } from "@/components/ui/use-toast";

export const checkAuthStatus = async (
  navigate: NavigateFunction,
  toast: typeof Toast
) => {
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("Checking auth status:", user);
  
  if (error || !user) {
    console.log("User not authenticated, redirecting to signin");
    toast({
      title: "Authentication required",
      description: "Please sign in to write a blog post",
    });
    navigate("/signin");
    return null;
  }
  
  return user;
};