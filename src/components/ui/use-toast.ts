
import { useToast } from "@/hooks/use-toast";

// Export a toast function that provides a simpler API
const toast = (props: Parameters<typeof useToast>[0]["toast"][0]) => {
  // This implementation will work with the hook approach
  const { toast: hookToast } = useToast();
  return hookToast(props);
};

export { useToast, toast };
