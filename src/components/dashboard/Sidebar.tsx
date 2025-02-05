
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, Plus, Scale, Brain, Sun, Moon, LogOut, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const menuItems = [
    {
      title: "Browse Tools",
      icon: Search,
      path: "/tools/categories",
      description: "Search and filter tools",
      isNew: false,
    },
    {
      title: "Add Tools",
      icon: Plus,
      path: "/tools/add",
      description: "Track your tools",
      isNew: false,
    },
    {
      title: "Compare",
      icon: Scale,
      path: "/tools/compare",
      description: "Compare tool features",
      isNew: false,
    },
    {
      title: "AI Suggestions",
      icon: Brain,
      path: "/tools/recommendations",
      description: "Get personalized recommendations",
      isNew: true,
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/tools/analytics",
      description: "Track spending and usage",
      isNew: true,
    },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    }
  };

  return (
    <aside className="min-h-screen w-80 bg-white border-r border-gray-100 p-6 relative transition-colors duration-300 flex flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Manage tools
            </p>
          </div>
        </div>
        
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "group flex items-start gap-4 px-4 py-4 rounded-lg transition-all duration-300 relative overflow-hidden hover:shadow-sm",
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {item.isNew && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
              <item.icon className={cn(
                "h-5 w-5 mt-0.5 transition-transform duration-300 group-hover:scale-110",
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-600"
              )} />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none mb-1">{item.title}</span>
                <span className={cn(
                  "text-xs transition-colors duration-300",
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}>{item.description}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3 pt-6 mt-auto">
        <Button
          variant="ghost"
          size="lg"
          onClick={toggleDarkMode}
          className="w-full justify-start gap-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

