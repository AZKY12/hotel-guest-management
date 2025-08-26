// src/pages/GuestList.tsx
import React, { useEffect, useRef, useState } from 'react';
import pb from '../lib/pocketbase';
import { Link } from 'react-router-dom';

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

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [q, setQ] = useState('');
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const searchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    fetchGuests(); // initial load

    return () => {
      mountedRef.current = false;
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce wrapper for search input: delays calling fetchGuests while typing
  useEffect(() => {
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current);
    }
    // 300ms debounce
    searchTimerRef.current = window.setTimeout(() => {
      fetchGuests(q);
    }, 300);

    return () => {
      if (searchTimerRef.current) {
        window.clearTimeout(searchTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function fetchGuests(query?: string) {
    if (fetchingRef.current) return; // avoid concurrent fetches
    fetchingRef.current = true;

    try {
      let res;
      const trimmed = (query ?? '').trim();

      if (trimmed.length > 0) {
        // escape single quotes by doubling them (basic sanitization for PocketBase filter)
        const safe = trimmed.replace(/'/g, "''");
        const filter = `first_name ~ '${safe}' || last_name ~ '${safe}' || email ~ '${safe}'`;
        res = await pb.collection('guests').getList(1, 50, { filter });
      } else {
        res = await pb.collection('guests').getList(1, 50);
      }

      // map result to typed Guest[] (safe and explicit)
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
      const message = err?.message || '';
      const causeName = err?.cause?.name || err?.name || '';

      // ignore PocketBase autocancelled / AbortError (common during HMR / StrictMode)
      if (message.includes('autocancelled') || causeName === 'AbortError') {
        console.warn('Ignored autocancelled request', err);
      } else {
        console.error('Failed to load guests', err);
        // For dev you can uncomment alert, but console is usually enough:
        // alert('Failed to load guests');
      }
    } finally {
      fetchingRef.current = false;
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Guests</h1>
        <Link to="/guests/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Guest
        </Link>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name/email"
          className="border p-2 w-full"
        />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td className="border p-2">
                {g.first_name} {g.last_name}
              </td>
              <td className="border p-2">{g.email}</td>
              <td className="border p-2">{g.phone}</td>
              <td className="border p-2">
                <Link to={`/guests/${g.id}`} className="text-blue-600">
                  View / Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
