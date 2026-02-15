import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import Skeleton from "../components/Skeleton";

export default function Components() {
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    component_name: "",
    part_code: "",
    current_stock: 0,
    monthly_required_quantity: 0
  });
  const [procurementStatus, setProcurementStatus] = useState(null);

  const handleRequestProcurement = (item) => {
    setProcurementStatus({ id: item.id, message: `Procurement request sent for ${item.component_name}` });
    setTimeout(() => setProcurementStatus(null), 3000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/analytics/shortage");
      setComponents(res.data);
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        component_name: item.component_name,
        part_code: item.part_code,
        current_stock: item.current_stock,
        monthly_required_quantity: item.monthly_required_quantity
      });
    } else {
      setEditingId(null);
      setForm({
        component_name: "",
        part_code: "",
        current_stock: 0,
        monthly_required_quantity: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/components/${editingId}`, form);
      } else {
        await API.post("/components", form);
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Submit error:", err);
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try {
        await API.delete(`/components/${id}`);
        fetchData();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const filtered = components.filter(c =>
    c.component_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.part_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search components or part numbers..."
            className="input-field pl-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Component
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Component</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Part Code</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width="180px" height="16px" /><Skeleton width="100px" height="10px" className="mt-2" /></td>
                    <td className="px-6 py-4"><Skeleton width="100px" height="14px" /></td>
                    <td className="px-6 py-4"><Skeleton width="80px" height="20px" circle /></td>
                    <td className="px-6 py-4"><div className="flex justify-center gap-2"><Skeleton width="32px" height="32px" circle /><Skeleton width="32px" height="32px" circle /></div></td>
                  </tr>
                ))
              ) : (
                <AnimatePresence>
                  {filtered.length > 0 ? filtered.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`table-row-hover group ${item.stock_status === 'LOW STOCK' ? 'bg-red-500/[0.02]' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.stock_status === 'LOW STOCK' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'}`}>
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{item.component_name}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">#{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono tracking-tighter">{item.part_code}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm font-black ${item.stock_status === 'LOW STOCK' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {item.current_stock}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{item.stock_status === 'LOW STOCK' ? 'Replenish' : 'Optimal'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.stock_status === 'LOW STOCK' && (
                            <button
                              onClick={() => handleRequestProcurement(item)}
                              className="w-9 h-9 flex items-center justify-center bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="w-9 h-9 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-9 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-slate-500 text-sm italic">
                        No results found.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Procurement Notification */}
      <AnimatePresence>
        {procurementStatus && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <div className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-400/30">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-sm font-bold tracking-tight">{procurementStatus.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-md glass-card p-10 shadow-2xl border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-white tracking-tighter">
                  {editingId ? "Edit Component" : "New Component"}
                </h3>
                <button onClick={handleCloseModal} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-full">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Component Identity</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Resistor 10k"
                    value={form.component_name}
                    onChange={(e) => setForm({ ...form, component_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Part / Serial Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. RES-103"
                    value={form.part_code}
                    onChange={(e) => setForm({ ...form, part_code: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">In Stock</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={form.current_stock}
                      onChange={(e) => setForm({ ...form, current_stock: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Monthly Need</label>
                    <input
                      type="number"
                      required
                      className="input-field"
                      value={form.monthly_required_quantity}
                      onChange={(e) => setForm({ ...form, monthly_required_quantity: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1 py-3 text-sm font-bold uppercase tracking-widest">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-3 text-sm font-bold uppercase tracking-widest">
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
