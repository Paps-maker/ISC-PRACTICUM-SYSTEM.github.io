
import { useToast } from "@/hooks/use-toast";

// Export a toast function that provides a simpler API
const toast = (props: any) => {
  // This implementation will work with the hook approach
  const { toast: hookToast } = useToast();
  return hookToast(props);
};

export { useToast, toast };
