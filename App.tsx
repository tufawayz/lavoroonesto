import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ResourcesPage from './components/ResourcesPage';
import type { AppView, Report, ExperienceReport, JobOfferReport } from './types';
import ReportDetail from './components/ReportDetail';
import AddReportChoice from './components/AddReportChoice';
import JobOfferForm from './components/JobOfferForm';
import JobOfferReportDetail from './components/JobOfferReportDetail';
import AdminLogin from './components/AdminLogin';
import { ReportType } from './types';
import { TOP_COMPANIES, SECTORS } from './constants';

const API_ENDPOINT = '/api/gemini-proxy';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [reports, setReports] = useState<Report[]>([]);
  const [companies, setCompanies] = useState<string[]>([...TOP_COMPANIES]);
  const [customSectors, setCustomSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [supportedReports, setSupportedReports] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('lavoroOnestoSupportedReports');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Error loading supported reports:", error);
        return [];
    }
  });
  
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getInitialData' })
      });
      if (!response.ok) throw new Error('Failed to fetch data from server.');
      const data = await response.json();
      
      const parsedReports = data.reports.map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt)
      }));

      setReports(parsedReports);

      const initialCompanies = new Set([...TOP_COMPANIES, ...data.companies]);
      setCompanies(Array.from(initialCompanies).sort());

      const allSectors = new Set([...SECTORS, ...data.sectors]);
      setCustomSectors(data.sectors.sort());

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      console.error("Error fetching initial data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    try {
        localStorage.setItem('lavoroOnestoSupportedReports', JSON.stringify(supportedReports));
    } catch (error) {
        console.error("Error saving supported reports:", error);
    }
  }, [supportedReports]);


  const handleAddReport = async (newReport: ExperienceReport | JobOfferReport) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addReport', payload: { report: newReport } }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Il server ha restituito un errore non valido.' }));
            throw new Error(errorData.error || `Il server ha risposto con stato ${response.status}.`);
        }
        
        await fetchInitialData(); // Refresh all data
        window.location.hash = '#/';
    } catch (err: any) {
        clearTimeout(timeoutId);
        console.error("Error adding report:", err);
        
        let alertMessage = 'Impossibile salvare la segnalazione. Riprova più tardi.';
        
        if (err.name === 'AbortError') {
             alertMessage = 'Il server non ha risposto in tempo. Questo può essere un problema temporaneo di rete o un errore di configurazione del backend. Riprova tra poco.';
        } else if (err.message) {
            alertMessage += `\n\nDettagli: ${err.message}`;
        }

        alert(alertMessage);
        throw err; // Re-throw the error so the form component can handle its state
    }
  };

  const handleSupport = async (id: string) => {
    if (supportedReports.includes(id)) return;

    // Optimistic UI update
    setReports(prev =>
      prev.map(r => r.id === id ? { ...r, supportCount: r.supportCount + 1 } : r)
    );
    setSupportedReports(prev => [...prev, id]);

    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'supportReport', payload: { id } })
        });
    } catch (err) {
        console.error("Error supporting report:", err);
        // Revert UI on failure
        setReports(prev =>
            prev.map(r => r.id === id ? { ...r, supportCount: r.supportCount - 1 } : r)
        );
        setSupportedReports(prev => prev.filter(supportedId => supportedId !== id));
        alert("Impossibile registrare il supporto. Riprova più tardi.");
    }
  };
  
  const handleDeleteReport = async (id: string) => {
    if (!isAdmin) {
        alert("Azione non autorizzata.");
        return;
    }
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'deleteReport', payload: { id, adminPassword } })
        });
        
        if (response.status === 401) {
             alert("Password di amministrazione errata.");
             setIsAdmin(false);
             setAdminPassword('');
             window.location.hash = '#/admin';
             return;
        }

        if (!response.ok) throw new Error('Failed to delete the report.');
        
        setReports(prev => prev.filter(r => r.id !== id));

        const pathParts = currentPath.slice(1).split('/').filter(p => p);
        if (pathParts[0] === 'report' && pathParts[1] === id) {
          window.location.hash = '#/';
        }

    } catch (err) {
        console.error("Error deleting report:", err);
        alert("Impossibile eliminare la segnalazione. Riprova più tardi.");
    }
  };

  const handleAdminLogin = (password: string) => {
    setAdminPassword(password);
    setIsAdmin(true);
    window.location.hash = '#/';
  };
  
  const renderContent = () => {
    const allSectors = [...SECTORS, ...customSectors].sort();

    const pathParts = currentPath.slice(1).split('/').filter(p => p);
    const view = pathParts[0] || 'dashboard';
    const param = pathParts[1];

    switch (view) {
      case 'dashboard':
        return <Dashboard 
                  reports={reports} 
                  onSupport={handleSupport}
                  companies={companies}
                  supportedReports={supportedReports}
                  allSectors={allSectors}
                  isLoading={isLoading}
                  error={error}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteReport}
                />;
      case 'segnala':
        if (param === 'esperienza') {
          return <ReportForm onAddReport={handleAddReport} companies={companies} sectors={allSectors} />;
        }
        if (param === 'offerta') {
          return <JobOfferForm onAddReport={handleAddReport} companies={companies} sectors={allSectors} />;
        }
        return <AddReportChoice />;
      
      case 'risorse':
        return <ResourcesPage />;
      
      case 'admin':
        return <AdminLogin onLogin={handleAdminLogin} />;

      case 'report':
        const report = reports.find(r => r.id === param);
        if (!report) {
            // If still loading, it might appear later
            if (isLoading) return null;
            window.location.hash = '#/';
            return null;
        }
        const isSupported = supportedReports.includes(report.id);
        if (report.type === ReportType.Experience) {
            return <ReportDetail report={report} onSupport={handleSupport} isSupported={isSupported} isAdmin={isAdmin} onDelete={handleDeleteReport}/>;
        }
        if (report.type === ReportType.JobOffer) {
            return <JobOfferReportDetail report={report} onSupport={handleSupport} isSupported={isSupported} isAdmin={isAdmin} onDelete={handleDeleteReport} />;
        }
        return null;

      default:
        window.location.hash = '#/';
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Lavoro Onesto. Tutti i diritti riservati (in teoria).</p>
        <p className="mt-1">Creato per promuovere la trasparenza e l'equità nel mondo del lavoro.</p>
      </footer>
    </div>
  );
};

export default App;