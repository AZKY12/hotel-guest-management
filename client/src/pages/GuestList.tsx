import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit } from 'react-icons/fi';
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

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
};

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const fetchLock = useRef(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    fetchGuests();
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => fetchGuests(q), 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function fetchGuests(query?: string) {
    if (fetchLock.current) return;
    fetchLock.current = true;
    setLoading(true);
    setError(null);

    try {
      let res;
      const trimmed = (query ?? '').trim();
      if (trimmed.length > 0) {
        const safe = trimmed.replace(/'/g, "''");
        const filter = `first_name ~ '${safe}' || last_name ~ '${safe}' || email ~ '${safe}'`;
        res = await pb.collection('guests').getList(1, 50, { filter });
      } else {
        res = await pb.collection('guests').getList(1, 50);
      }

      const mapped: Guest[] = (res.items as any[]).map((it) => ({
        id: it.id,
        created: it.created,
        first_name: (it.first_name as string) ?? '',
        last_name: (it.last_name as string) ?? '',
        email: (it.email as string) ?? '',
        phone: (it.phone as string) ?? undefined,
        address: (it.address as string) ?? undefined,
        date_of_birth: (it.date_of_birth as string) ?? undefined,
      }));

      if (!mountedRef.current) return;
      setGuests(mapped);
    } catch (err: any) {
      const msg = err?.message || '';
      const causeName = err?.cause?.name || err?.name || '';
      if (msg.includes('autocancelled') || causeName === 'AbortError') {
        console.warn('Ignored autocancelled request', err);
      } else {
        console.error(err);
        setError('Failed to load guests. See console.');
      }
    } finally {
      fetchLock.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      {/* header / hero full width */}
      <div className="w-full px-6 py-8 md:py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Guest Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage guest records — add, search, view and edit guest details.</p>
          </div>
          <div>
            <Link to="/guests/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition">
              <FiPlus /> <span className="hidden sm:inline">Add Guest</span>
            </Link>
          </div>
        </div>
      </div>

      {/* content full width */}
      <div className="w-full px-6 pb-12">
        <div className="w-full bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="text-white pl-10 pr-3 py-2 w-full rounded-md border border-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="Search guests by name or email..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="text-sm text-slate-500">
              {loading ? <span>Loading guests...</span> : <span>{guests.length} guests</span>}
              {error && <span className="text-red-500 ml-3"> • {error}</span>}
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto">
              <thead className="text-slate-500 text-sm uppercase tracking-wide">
                <tr>
                  <th className="text-left py-3 px-4">Guest</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">DOB</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                <AnimatePresence>
                  {guests.map((g) => (
                    <motion.tr key={g.id} initial="hidden" animate="enter" exit="exit" variants={itemVariants} transition={{ duration: 0.16 }} className="bg-white hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                            {g.first_name?.charAt(0)?.toUpperCase() || '?'}{g.last_name?.charAt(0)?.toUpperCase() || ''}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{g.first_name} {g.last_name}</div>
                            <div className="text-xs text-slate-400">Joined {g.created ? new Date(g.created).toLocaleDateString() : '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><div className="text-sm text-slate-700">{g.email}</div></td>
                      <td className="py-3 px-4 text-slate-600">{g.phone || '-'}</td>
                      <td className="py-3 px-4 text-slate-600">{g.date_of_birth ? new Date(g.date_of_birth).toLocaleDateString() : '-'}</td>
                      <td className="py-3 px-4">
                        <Link to={`/guests/${g.id}`} className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline" aria-label={`Edit ${g.first_name} ${g.last_name}`}>
                          <FiEdit /> Edit
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden grid grid-cols-1 gap-3 mt-4">
            <AnimatePresence>
              {guests.map((g) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {g.first_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{g.first_name} {g.last_name}</div>
                        <div className="text-sm text-slate-500">{g.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/guests/${g.id}`} className="text-indigo-600 inline-flex items-center gap-2">
                        <FiEdit />
                      </Link>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <div>{g.phone || '—'}</div>
                    <div>{g.date_of_birth ? new Date(g.date_of_birth).toLocaleDateString() : '—'}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
