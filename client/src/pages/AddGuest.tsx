import React, { useState } from 'react';
import pb from '../lib/pocketbase';
import { useNavigate } from 'react-router-dom';

export default function AddGuest(){
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'', phone:'', address:'', date_of_birth:'' });
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await pb.collection('guests').create(form);
      nav('/guests');
    } catch (err: any) {
      alert('Failed to create guest: ' + (err?.message || err));
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Add New Guest</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="First name" className="w-full border p-2" />
        <input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Last name" className="w-full border p-2" />
        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full border p-2" />
        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" className="w-full border p-2" />
        <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" className="w-full border p-2" />
        <input value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} type="date" className="w-full border p-2" />
        <div className="flex gap-3">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => nav('/guests')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
