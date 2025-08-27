// client/src/pages/GuestDetail.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiSave, FiChevronLeft } from 'react-icons/fi';
import pb from '../lib/pocketbase';

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  created?: string;
};

export default function GuestDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // refs to prevent race conditions / updating after unmount
  const mountedRef = useRef(true);
  const fetchLock = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    if (id) fetchGuest(id);

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchGuest(guestId: string) {
    if (fetchLock.current) return;
    fetchLock.current = true;
    setLoading(true);
    setError(null);

    try {
      const r: any = await pb.collection('guests').getOne(guestId);
      if (!mountedRef.current) return;
      setGuest({
        id: r.id,
        created: r.created,
        first_name: r.first_name ?? '',
        last_name: r.last_name ?? '',
        email: r.email ?? '',
        phone: r.phone ?? '',
        address: r.address ?? '',
        date_of_birth: r.date_of_birth ?? '',
      });
    } catch (err: any) {
      const message = err?.message || '';
      const causeName = err?.cause?.name || err?.name || '';

      // ignore PocketBase auto-cancel / AbortError — common in dev (HMR / StrictMode)
      if (message.includes('autocancelled') || causeName === 'AbortError') {
        console.warn('Ignored autocancelled request (getOne)', err);
      } else {
        console.error('Failed to load guest', err);
        if (mountedRef.current) setError('Failed to load guest');
      }
    } finally {
      fetchLock.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }

  async function save() {
    if (!id || !guest) return;
    setSaving(true);
    setError(null);

    try {
      await pb.collection('guests').update(id, {
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        phone: guest.phone || undefined,
        address: guest.address || undefined,
        date_of_birth: guest.date_of_birth || undefined,
      });
      nav('/guests');
    } catch (err: any) {
      const message = err?.message || '';
      const causeName = err?.cause?.name || err?.name || '';
      if (message.includes('autocancelled') || causeName === 'AbortError') {
        console.warn('Ignored autocancelled request (update)', err);
      } else {
        console.error('Failed to save guest', err);
        if (mountedRef.current) setError('Failed to save guest');
      }
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }

  async function remove() {
    if (!id) return;
    const ok = window.confirm('Are you sure you want to delete this guest? This action cannot be undone.');
    if (!ok) return;

    try {
      await pb.collection('guests').delete(id);
      nav('/guests');
    } catch (err: any) {
      const message = err?.message || '';
      const causeName = err?.cause?.name || err?.name || '';
      if (message.includes('autocancelled') || causeName === 'AbortError') {
        console.warn('Ignored autocancelled request (delete)', err);
      } else {
        console.error('Failed to delete guest', err);
        if (mountedRef.current) setError('Failed to delete guest');
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 w-full">
        <div className="text-slate-500">Loading guest...</div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen p-6 w-full">
        <div className="text-center text-slate-600">{error || 'Guest not found.'}</div>
        <div className="mt-4 text-center">
          <button onClick={() => nav('/guests')} className="text-indigo-600 inline-flex items-center gap-2">
            <FiChevronLeft /> Back to guests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="w-full px-6 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{guest.first_name} {guest.last_name}</h1>
              <div className="text-sm text-slate-500">Guest profile & details</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => nav('/guests')} className="text-slate-600 hover:text-slate-800 inline-flex items-center gap-2"><FiChevronLeft /> Back</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm w-full p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">First name</label>
                <input value={guest.first_name} onChange={(e) => setGuest({ ...guest, first_name: e.target.value })} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Last name</label>
                <input value={guest.last_name} onChange={(e) => setGuest({ ...guest, last_name: e.target.value })} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Email</label>
                <input type="email" value={guest.email} onChange={(e) => setGuest({ ...guest, email: e.target.value })} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Phone</label>
                <input value={guest.phone || ''} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">Date of birth</label>
                <input type="date" value={guest.date_of_birth || ''} onChange={(e) => setGuest({ ...guest, date_of_birth: e.target.value })} className="text-white w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <textarea value={guest.address || ''} onChange={(e) => setGuest({ ...guest, address: e.target.value })} className="text-white w-full border rounded-md p-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </div>
            </div>

            {error && <div className="mt-3 text-red-500">{error}</div>}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button onClick={remove} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100" disabled={saving}><FiTrash2 /> Delete</button>
              <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white shadow hover:shadow-lg transform hover:-translate-y-0.5 transition" disabled={saving}><FiSave /> {saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
