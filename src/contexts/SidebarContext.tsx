import React from "react";
// src/contexts/SidebarContext.tsx
type SidebarContextType = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: any }) {
  const [isExpanded, setIsExpanded] = useState(true); // Default expanded
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      if (timeoutId) clearTimeout(timeoutId);
      return !prev;
    });
  };

  // Auto-collapse after 2s inactivity
  useEffect(() => {
    if (isExpanded) {
      const id = setTimeout(() => setIsExpanded(false), 2000);
      setTimeoutId(id);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isExpanded]);

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}