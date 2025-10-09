import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react';
const Navigate = useNavigate;

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form.name, form.email, form.password);
    
    
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded mt-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
