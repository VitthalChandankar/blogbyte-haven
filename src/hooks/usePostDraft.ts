import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDraftOperations } from "./useDraftOperations";
import { usePublishOperations } from "./usePublishOperations";
import { checkAuthStatus } from "@/lib/auth";

export const usePostDraft = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { handleSaveAsDraft } = useDraftOperations({ 
    title, 
    content, 
    setIsLoading, 
    toast 
  });
  
  const { handlePublish } = usePublishOperations({ 
    title, 
    content, 
    setIsLoading, 
    toast, 
    navigate 
  });

  useEffect(() => {
    const loadDraft = async () => {
      const user = await checkAuthStatus(navigate, toast);
      if (!user) return;
      
      console.log("Checking for existing draft for user:", user.id);
      const { handleLoadDraft } = useDraftOperations({ 
        title, 
        content, 
        setIsLoading, 
        toast 
      });
      await handleLoadDraft(user.id, setTitle, setContent);
    };

    loadDraft();
  }, [navigate, toast]);

  return {
    title,
    setTitle,
    content,
    setContent,
    isLoading,
    handleSaveAsDraft,
    handlePublish
  };
};