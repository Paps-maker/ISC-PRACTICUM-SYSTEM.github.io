
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import MobileMenuToggle from "./sidebar/MobileMenuToggle";
import NavLinks from "./sidebar/NavLinks";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {isMobile && (
        <MobileMenuToggle 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />
      )}

      <aside
        className={cn(
          "bg-white border-r h-screen transition-all",
          isMobile
            ? `fixed top-0 left-0 w-16 z-40 transform ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-64",
          className
        )}
      >
        <div className="p-4">
          <div className="text-xl font-bold mb-6 flex items-center justify-center">
            {!isMobile && "ISC Practicum"}
          </div>

          <NavLinks 
            role={user.role} 
            isMobile={isMobile} 
            closeMobileMenu={closeMobileMenu} 
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
