import { useEffect, useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  CircuitBoard,
  ArrowRight,
  TrendingDown,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from "framer-motion";
import API from "../api";
import Skeleton from "../components/Skeleton";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalComponents: 0,
    lowStockCount: 0,
    totalConsumption: 0,
    totalPCBs: 0
  });
  const [lowStockPreview, setLowStockPreview] = useState([]);
  const [consumptionTrend, setConsumptionTrend] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/analytics/shortage");
        const data = res.data;

        // Derive stats from analytics data
        const lowStock = data.filter(item => item.stock_status === 'LOW STOCK');
        const consumption = data.reduce((acc, curr) => acc + (Number(curr.total_required) || 0), 0);

        setStats({
          totalComponents: data.length,
          lowStockCount: lowStock.length,
          totalConsumption: consumption,
          totalPCBs: 42
        });

        // Generate dummy trend data for visualization purposes
        const trend = Array.from({ length: 7 }, (_, i) => ({
          name: `Day ${i + 1}`,
          value: Math.floor(Math.random() * 500) + 200
        }));
        setConsumptionTrend(trend);

        setLowStockPreview(lowStock.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Slight delay to show off skeletons
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "Total Components", value: stats.totalComponents, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Low Stock Items", value: stats.lowStockCount, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
    { label: "Total Consumption", value: stats.totalConsumption.toLocaleString(), icon: TrendingDown, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Total PCBs", value: stats.totalPCBs, icon: CircuitBoard, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card group hover:-translate-y-1 transition-all duration-300"
          >
            {loading ? (
              <div className="space-y-3">
                <Skeleton circle width="48px" height="48px" />
                <Skeleton width="60%" height="14px" />
                <Skeleton width="40%" height="24px" className="mt-2" />
              </div>
            ) : (
              <>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Consumption Trend</h3>
              <p className="text-xs text-slate-500 font-medium">Weekly unit consumption analysis</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">7 Days</span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                    itemStyle={{ color: '#6366f1' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Shortage Analytics Preview */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6 tracking-tight">
            <TrendingUp size={18} className="text-indigo-400" />
            Procurement Status
          </h3>
          <div className="space-y-6 flex-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton width="40%" height="10px" />
                    <Skeleton width="20%" height="10px" />
                  </div>
                  <Skeleton width="100%" height="6px" />
                </div>
              ))
            ) : (
              <>
                {lowStockPreview.slice(0, 4).map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-slate-400">{item.component_name}</span>
                      <span className="text-red-400">{item.shortage_percentage}% Shortage</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.shortage_percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400"
                      />
                    </div>
                  </div>
                ))}
                {lowStockPreview.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm italic">
                    Inventory levels are optimal.
                  </div>
                )}
              </>
            )}
          </div>
          <Link to="/analytics" className="mt-8 btn-secondary w-full text-center py-2.5 text-sm uppercase tracking-widest font-bold">
            Full Analytics
          </Link>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Low Stock Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2 tracking-tight">
              <AlertTriangle size={18} className="text-red-400" />
              Low Stock Alerts
            </h3>
            <Link to="/components" className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Inventory Detail
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton width="60%" height="14px" /> <Skeleton width="30%" height="10px" className="mt-1" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton width="24px" height="14px" className="ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  lowStockPreview.length > 0 ? lowStockPreview.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{item.component_name}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{item.part_code}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        <span className="text-sm font-black text-red-400">{item.current_stock}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-6 py-10 text-center text-slate-500 italic text-sm">
                        Stock is healthy.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Needs Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2 tracking-tight">
              <TrendingUp size={18} className="text-emerald-400" />
              Resource Demand
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton width="60%" height="14px" /> <Skeleton width="30%" height="10px" className="mt-1" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton width="24px" height="14px" className="ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  [...lowStockPreview].sort((a, b) => b.total_required - a.total_required).slice(0, 5).map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{item.component_name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{item.part_code}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-emerald-400">+{item.total_required}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
