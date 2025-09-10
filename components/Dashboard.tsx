

import React, { useState, useMemo } from 'react';
import { Report, Sector, ReportType } from '../types';
import ReportList from './ReportList';

interface DashboardProps {
  reports: Report[];
  onSupport: (id: string) => void;
  companies: string[];
  supportedReports: string[];
  allSectors: string[];
  isLoading: boolean;
  error: string | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onSupport, companies, supportedReports, allSectors, isLoading, error, isAdmin, onDelete }) => {
  const [companyFilter, setCompanyFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  const filteredReports = useMemo(() => {
    const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return sortedReports.filter(report => {
        const companyMatch = companyFilter 
            ? report.companyName.toLowerCase().includes(companyFilter.toLowerCase())
            : true;
        
        const sectorMatch = sectorFilter
            ? report.sector.toLowerCase().includes(sectorFilter.toLowerCase())
            : true;

        return companyMatch && sectorMatch;
    });
  }, [reports, companyFilter, sectorFilter]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-sky-600"></i>
          <p className="mt-4 text-slate-600">Caricamento segnalazioni...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center py-16 px-6 bg-red-50 rounded-lg shadow-md border border-red-200">
            <i className="fa-solid fa-circle-exclamation text-6xl text-red-400 mb-4"></i>
            <h3 className="text-2xl font-bold text-red-800">Oops! Qualcosa è andato storto.</h3>
            <p className="text-red-600 mt-2">{error}</p>
        </div>
      );
    }
    
    return <ReportList reports={filteredReports} onSupport={onSupport} supportedReports={supportedReports} isAdmin={isAdmin} onDelete={onDelete} />;
  }

  return (
    <div className="space-y-12">
      {/* Mission/Vision Hero Section */}
      <div className="text-center py-12 bg-sky-600 text-white rounded-2xl shadow-xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Offerte di lavoro ridicole? È ora di farsi sentire.</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-sky-100">
          Lavoro onesto è la piattaforma per denunciare anonimamente le offerte di lavoro e le esperienze lavorative inique in Italia.
          La tua voce conta.
        </p>
      </div>

       {/* Call to Action Section */}
       <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Ti hanno proposto un lavoro malpagato o condizioni inaccettabili?</h2>
            <p className="mt-2 text-slate-600">Non rimanere in silenzio. Condividi la tua esperienza per aiutare la community e creare consapevolezza.</p>
            <a 
                href="#/segnala"
                onClick={(e) => handleNav(e, '#/segnala')}
                className="mt-6 inline-flex items-center justify-center space-x-2 bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-lg font-semibold text-lg animate-pulse"
            >
                <i className="fa-solid fa-bullhorn"></i>
                <span>Segnala Ora</span>
            </a>
        </div>


      {/* Filter and Reports Section */}
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div>
                <label htmlFor="company-filter" className="block text-xl font-bold text-slate-800 mb-2">Filtra per Azienda</label>
                <input 
                    id="company-filter"
                    type="text"
                    list="company-filter-list"
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    placeholder="Cerca un'azienda..."
                    className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                <datalist id="company-filter-list">
                    {companies.map(c => <option key={c} value={c} />)}
                </datalist>
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Filtra per Settore</h2>
                <p className="text-sm text-slate-500 mt-1">Cerca un settore specifico per filtrare le segnalazioni.</p>
                <div className="mt-4">
                    <label htmlFor="sector-filter" className="sr-only">Cerca un settore</label>
                    <input 
                        id="sector-filter"
                        type="text"
                        list="sector-filter-list"
                        value={sectorFilter}
                        onChange={(e) => setSectorFilter(e.target.value)}
                        placeholder="Es. 'Ristorazione', 'IT', 'Logistica'..."
                        className="w-full px-4 py-2 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    />
                    <datalist id="sector-filter-list">
                        {allSectors.map(s => <option key={s} value={s} />)}
                    </datalist>
                </div>
            </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;