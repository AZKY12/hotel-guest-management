import React, { useEffect, useState } from 'react';
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

  useEffect(() => { fetchGuests(); }, []);

  async function fetchGuests(query: string = '') {
  try {
    const res = await pb.collection('guests').getList<Guest>(1, 50, {
      filter: query
        ? `first_name ~ "${query}" || last_name ~ "${query}" || email ~ "${query}"`
        : ''
    });
    setGuests(res.items);
  } catch (err) {
    console.error(err);
    alert('Failed to load guests');
  }
}


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Guests</h1>
        <Link to="/guests/new" className="bg-blue-600 text-white px-4 py-2 rounded">Add Guest</Link>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={e => {
            const val = e.target.value;
            setQ(val);
            fetchGuests(val);
          }}
          placeholder="Search by name/email"
          className="border p-2 w-full" />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr><th className="border p-2">Name</th><th className="border p-2">Email</th><th className="border p-2">Phone</th><th className="border p-2">Actions</th></tr>
        </thead>
        <tbody>
          {guests.map(g => (
            <tr key={g.id}>
              <td className="border p-2">{g.first_name} {g.last_name}</td>
              <td className="border p-2">{g.email}</td>
              <td className="border p-2">{g.phone}</td>
              <td className="border p-2">
                <Link to={`/guests/${g.id}`} className="text-blue-600">View / Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
