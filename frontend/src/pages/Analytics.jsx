import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  ArrowDownToLine,
  Filter,
  Loader2,
  RefreshCcw,
  Package,
  PieChart as PieIcon
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from "framer-motion";
import API from "../api";
import Skeleton from "../components/Skeleton";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/shortage");
      const shortageData = res.data || [];
      setData(shortageData);

      // Prepare Pie Chart Data
      const lowStock = shortageData.filter(i => i.stock_status === 'LOW STOCK').length;
      const optimal = shortageData.length - lowStock;
      setPieData([
        { name: 'Optimal', value: optimal, color: '#10b981' },
        { name: 'Low Stock', value: lowStock, color: '#f43f5e' }
      ]);

    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setTimeout(() => setLoading(false), 700);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Inventory Analytics</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Cross-component fulfillment mapping and shortage trends.</p>
        </div>
        <button
          onClick={fetchData}
          className="p-3 bg-slate-900 border border-slate-700/50 rounded-2xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all shadow-xl"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fulfillment Distribution Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-bold text-white tracking-tight">Fulfillment Distribution</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Stock levels across component inventory</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {loading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.slice(0, 15)}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="part_code"
                    stroke="#475569"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '10px' }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="current_stock"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStock)"
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Global Health Status (Pie) */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col">
          <h3 className="font-bold text-white mb-8 tracking-tight flex items-center gap-2">
            <PieIcon size={18} className="text-purple-400" />
            Inventory Health
          </h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {loading ? (
              <Skeleton width="200px" height="200px" circle />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={400}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(val) => <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              * Analytics are calculated based on monthly unit requirements vs current factory floor availability.
            </p>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-900/10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Fulfillment Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Component</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Available</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Required</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fulfillment Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width="150px" height="14px" /></td>
                    <td className="px-6 py-4"><Skeleton width="40px" height="14px" className="mx-auto" /></td>
                    <td className="px-6 py-4"><Skeleton width="40px" height="14px" className="mx-auto" /></td>
                    <td className="px-6 py-4"><Skeleton width="100%" height="8px" /></td>
                  </tr>
                ))
              ) : (
                data.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="table-row-hover group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.component_name}</p>
                      <p className="text-[10px] font-mono text-slate-500 italic">{item.part_code}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-center text-slate-300">{item.current_stock}</td>
                    <td className="px-6 py-4 text-sm font-black text-center text-slate-300">{item.total_required}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.shortage_percentage, 100)}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full ${Number(item.shortage_percentage) > 60 ? 'bg-red-500' :
                              Number(item.shortage_percentage) > 20 ? 'bg-orange-400' :
                                'bg-emerald-500'
                              }`}
                          />
                        </div>
                        <span className={`text-[11px] font-black w-10 text-right ${Number(item.shortage_percentage) > 60 ? 'text-red-400' :
                          Number(item.shortage_percentage) > 20 ? 'text-orange-400' :
                            'text-emerald-400'
                          }`}>
                          {item.shortage_percentage}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
