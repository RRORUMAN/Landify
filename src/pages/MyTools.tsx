
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  ArrowLeft, 
  DollarSign, 
  LayoutGrid, 
  Activity, 
  Calendar,
  Clock,
  TrendingUp,
  Users,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserTool } from "@/data/types";
import { MetricsGrid } from "@/components/tools/MetricsGrid";
import { CategoryTools } from "@/components/tools/CategoryTools";
import { EmptyToolsState } from "@/components/tools/EmptyToolsState";
import { Card } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MyTools = () => {
  const [tools, setTools] = useState<UserTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [activeToolsCount, setActiveToolsCount] = useState(0);
  const [nextBillingTotal, setNextBillingTotal] = useState(0);
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mostUsedCategory, setMostUsedCategory] = useState<string>('');
  const [usageEfficiency, setUsageEfficiency] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample usage data for the chart
  const usageData = [
    { name: 'Jan', usage: 65 },
    { name: 'Feb', usage: 78 },
    { name: 'Mar', usage: 82 },
    { name: 'Apr', usage: 70 },
    { name: 'May', usage: 85 },
    { name: 'Jun', usage: 92 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: userTools, error } = await supabase
          .from("user_tools")
          .select(`
            *,
            tool:tools(*)
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        const processedTools = userTools.map((userTool: any) => ({
          ...userTool,
          tool: userTool.tool
        }));

        setTools(processedTools);
        
        // Calculate metrics
        const totalMonthly = processedTools.reduce((acc, tool) => acc + (tool.monthly_cost || 0), 0);
        setMonthlySpend(totalMonthly);
        setActiveToolsCount(processedTools.length);
        
        // Calculate most used category
        const categoryCount = processedTools.reduce((acc, tool) => {
          const category = tool.tool?.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const mostUsed = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
        setMostUsedCategory(mostUsed?.[0] || 'None');

        // Calculate usage efficiency
        setUsageEfficiency(Math.round((activeToolsCount / processedTools.length) * 100));
        
        // Find next billing
        const upcomingBillings = processedTools
          .filter(tool => tool.next_billing_date)
          .sort((a, b) => new Date(a.next_billing_date!).getTime() - new Date(b.next_billing_date!).getTime());
        
        if (upcomingBillings.length > 0) {
          setNextBillingDate(upcomingBillings[0].next_billing_date!);
          setNextBillingTotal(upcomingBillings[0].monthly_cost || 0);
        }

      } catch (error) {
        console.error("Error fetching tools:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your tools. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const metrics = [
    {
      title: "Monthly Spend",
      value: `$${monthlySpend.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      tooltip: "Total monthly cost across all tools",
      trend: "+2.5%",
      trendUp: true
    },
    {
      title: "Active Tools",
      value: activeToolsCount.toString(),
      icon: LayoutGrid,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      tooltip: "Number of tools currently in use",
      trend: "0%",
      trendUp: false
    },
    {
      title: "Usage Efficiency",
      value: `${usageEfficiency}%`,
      icon: Activity,
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
      tooltip: "Percentage of tools actively used this month",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Most Used Category",
      value: mostUsedCategory,
      icon: PieChart,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      tooltip: "Category with highest tool usage",
      trend: "",
      trendUp: false
    },
    {
      title: "Next Billing",
      value: nextBillingDate ? `$${nextBillingTotal.toFixed(2)}` : "N/A",
      subtext: nextBillingDate ? format(new Date(nextBillingDate), 'MMM dd, yyyy') : "",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
      tooltip: "Amount due on next billing cycle",
      trend: "",
      trendUp: false
    }
  ];

  const categories = tools.reduce((acc, tool) => {
    const category = tool.tool?.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Tools</h1>
          </div>
          <div className="flex items-center gap-4">
            <Tabs defaultValue="grid" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" onClick={() => setViewMode('list')}>
                  <Activity className="w-4 h-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={() => navigate("/tools/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Tools
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.title} className="p-4 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                  {metric.trend && (
                    <span className={`text-sm ${metric.trendUp ? 'text-green-500' : 'text-gray-500'}`}>
                      {metric.trend}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-sm text-gray-500 dark:text-gray-400">{metric.title}</h3>
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                {metric.subtext && (
                  <p className="mt-1 text-sm text-gray-500">{metric.subtext}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Usage Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Tool Usage Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tools Grid/List */}
        {tools.length === 0 ? (
          <EmptyToolsState />
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {Object.entries(categories).map(([category, categoryTools]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {category}
                        <span className="text-gray-500 text-lg ml-2">
                          ({categoryTools.length})
                        </span>
                      </h2>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <CategoryTools 
                      category={category} 
                      tools={categoryTools}
                      viewMode={viewMode}
                    />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTools;
