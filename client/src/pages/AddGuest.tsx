import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';
import pb from '../lib/pocketbase';

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
};

export default function AddGuest() {
  const [form, setForm] = useState<FormState>({ first_name: '', last_name: '', email: '', phone: '', address: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const nav = useNavigate();

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) { setForm((s) => ({ ...s, [k]: v })); }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErrMsg(null);
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) { setErrMsg('First name, last name and email are required.'); return; }
    setLoading(true);
    try {
      await pb.collection('guests').create({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || undefined,
        address: form.address?.trim() || undefined,
        date_of_birth: form.date_of_birth || undefined,
      });
      nav('/guests');
    } catch (err: any) { console.error(err); setErrMsg('Failed to create guest. See console.'); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white w-full">
      <div className="w-full px-6 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Add New Guest</h1>
            <button onClick={() => nav('/guests')} className="inline-flex items-center gap-2 text-slate-600 hover:text-white"><FiX /> Cancel</button>
          </div>

          <div className="bg-white rounded-xl shadow-sm w-full p-6">
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-slate-600 mb-1">First name</label>
                <input required value={form.first_name} onChange={(e) => onChange('first_name', e.target.value)} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div><label className="block text-sm text-slate-600 mb-1">Last name</label>
                <input required value={form.last_name} onChange={(e) => onChange('last_name', e.target.value)} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div className="md:col-span-2"><label className="block text-sm text-slate-600 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div><label className="block text-sm text-slate-600 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => onChange('phone', e.target.value)} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div><label className="block text-sm text-slate-600 mb-1">Date of birth</label>
                <input type="date" value={form.date_of_birth} onChange={(e) => onChange('date_of_birth', e.target.value)} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div className="md:col-span-2"><label className="block text-sm text-slate-600 mb-1">Address</label>
                <textarea value={form.address} onChange={(e) => onChange('address', e.target.value)} className="text-white w-full border rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                {errMsg && <div className="text-red-500 text-sm mr-auto">{errMsg}</div>}
                <button type="button" onClick={() => nav('/guests')} className="px-4 py-2 rounded-md border text-slate-700 hover:text-white" disabled={loading}>Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:shadow-lg transform hover:-translate-y-0.5 transition" disabled={loading}><FiSave /> {loading ? 'Saving...' : 'Save Guest'}</button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
