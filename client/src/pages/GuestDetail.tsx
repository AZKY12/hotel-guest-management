import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pb from '../lib/pocketbase';

export default function GuestDetail() {
  const { id } = useParams<{id:string}>();
  const nav = useNavigate();
  const [guest, setGuest] = useState<any>(null);

  useEffect(() => {
    if(!id) return;
    pb.collection('guests').getOne(id)
      .then(r => setGuest(r))
      .catch(() => alert('Failed to load'));
  }, [id]);

  async function save() {
    try {
      await pb.collection('guests').update(id!, guest);
      alert('Saved');
      nav('/guests');
    } catch (err) { alert('Failed to save'); }
  }

  async function remove() {
    if (!confirm('Delete this guest?')) return;
    try {
      await pb.collection('guests').delete(id!);
      nav('/guests');
    } catch { alert('Failed to delete'); }
  }

  if (!guest) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Edit Guest</h2>
      <input value={guest.first_name} onChange={e => setGuest({...guest, first_name: e.target.value})} className="w-full border p-2 mb-2" />
      <input value={guest.last_name} onChange={e => setGuest({...guest, last_name: e.target.value})} className="w-full border p-2 mb-2" />
      <input value={guest.email} onChange={e => setGuest({...guest, email: e.target.value})} className="w-full border p-2 mb-2" />
      <input value={guest.phone || ''} onChange={e => setGuest({...guest, phone: e.target.value})} className="w-full border p-2 mb-2" />
      <input value={guest.address || ''} onChange={e => setGuest({...guest, address: e.target.value})} className="w-full border p-2 mb-2" />
      <input value={guest.date_of_birth || ''} onChange={e => setGuest({...guest, date_of_birth: e.target.value})} type="date" className="w-full border p-2 mb-2" />
      <div className="flex gap-3 mt-3">
        <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button onClick={remove} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
}
