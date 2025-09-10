
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onLogin(password);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sky-100">
                 <i className="fa-solid fa-lock h-6 w-6 text-sky-600"></i>
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-900">Accesso Area Admin</h2>
            <p className="mt-2 text-sm text-slate-500">
                Inserisci la password per accedere alle funzionalità di moderazione.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <i className="fa-solid fa-arrow-right-to-bracket h-5 w-5 text-sky-500 group-hover:text-sky-400"></i>
              </span>
              Accedi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
