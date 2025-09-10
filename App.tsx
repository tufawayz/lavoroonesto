// FIX: Corrected typo in React import to properly import hooks.
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ResourcesPage from './components/ResourcesPage';
import type { AppView, Report, ExperienceReport, JobOfferReport } from './types';
import ReportDetail from './components/ReportDetail';
import AddReportChoice from './components/AddReportChoice';
import JobOfferForm from './components/JobOfferForm';
import JobOfferReportDetail from './components/JobOfferReportDetail';
import { ReportType } from './types';
import { TOP_COMPANIES, SECTORS } from './constants';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  
  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const savedReports = localStorage.getItem('lavoroOnestoReports');
      if (savedReports) {
        return JSON.parse(savedReports).map((report: Report) => ({
          ...report,
          createdAt: new Date(report.createdAt),
        }));
      }
    } catch (error) {
      console.error("Error loading reports from localStorage:", error);
    }
    return [];
  });

  const [companies, setCompanies] = useState<string[]>(() => {
    try {
      const savedCompanies = localStorage.getItem('lavoroOnestoCompanies');
      const initialCompanies = new Set([...TOP_COMPANIES, ...(savedCompanies ? JSON.parse(savedCompanies) : [])]);
      return Array.from(initialCompanies);
    } catch (error) {
      console.error("Error loading companies from localStorage:", error);
      return [...TOP_COMPANIES];
    }
  });

  const [customSectors, setCustomSectors] = useState<string[]>(() => {
    try {
        const savedSectors = localStorage.getItem('lavoroOnestoCustomSectors');
        return savedSectors ? JSON.parse(savedSectors) : [];
    } catch (error) {
        console.error("Error loading custom sectors from localStorage:", error);
        return [];
    }
  });

  const [supportedReports, setSupportedReports] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('lavoroOnestoSupportedReports');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Error loading supported reports:", error);
        return [];
    }
  });


  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lavoroOnestoReports', JSON.stringify(reports));
    } catch (error) {
      console.error("Error saving reports to localStorage:", error);
    }
  }, [reports]);

   useEffect(() => {
    try {
      // Filter out TOP_COMPANIES to only save user-added ones
      const userAddedCompanies = companies.filter(c => !TOP_COMPANIES.includes(c));
      localStorage.setItem('lavoroOnestoCompanies', JSON.stringify(userAddedCompanies));
    } catch (error) {
      console.error("Error saving companies to localStorage:", error);
    }
  }, [companies]);

  useEffect(() => {
    try {
        localStorage.setItem('lavoroOnestoCustomSectors', JSON.stringify(customSectors));
    } catch (error) {
        console.error("Error saving custom sectors to localStorage:", error);
    }
  }, [customSectors]);

  useEffect(() => {
    try {
        localStorage.setItem('lavoroOnestoSupportedReports', JSON.stringify(supportedReports));
    } catch (error) {
        console.error("Error saving supported reports:", error);
    }
  }, [supportedReports]);


  const handleAddNewCompany = (companyName: string) => {
    const trimmedName = companyName.trim();
    if (trimmedName && !companies.find(c => c.toLowerCase() === trimmedName.toLowerCase())) {
        setCompanies(prev => [...prev, trimmedName].sort());
    }
  };

  const handleAddNewSector = (sectorName: string) => {
    const trimmedName = sectorName.trim();
    if (trimmedName && !SECTORS.includes(trimmedName) && !customSectors.includes(trimmedName)) {
        setCustomSectors(prev => [...prev, trimmedName].sort());
    }
  };


  const handleAddExperienceReport = (newReport: ExperienceReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
    handleAddNewCompany(newReport.companyName);
    if (!SECTORS.includes(newReport.sector)) {
        handleAddNewSector(newReport.sector);
    }
    window.location.hash = '#/';
  };

  const handleAddJobOfferReport = (newReport: JobOfferReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
    handleAddNewCompany(newReport.companyName);
    if (!SECTORS.includes(newReport.sector)) {
        handleAddNewSector(newReport.sector);
    }
    window.location.hash = '#/';
  };

  const handleSupport = (id: string) => {
    if (supportedReports.includes(id)) {
        return; // Already supported, do nothing
    }

    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === id ? { ...report, supportCount: report.supportCount + 1 } : report
      )
    );

    setSupportedReports(prev => [...prev, id]);
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
                />;
      case 'segnala':
        if (param === 'esperienza') {
          return <ReportForm onAddReport={handleAddExperienceReport} companies={companies} sectors={allSectors} />;
        }
        if (param === 'offerta') {
          return <JobOfferForm onAddReport={handleAddJobOfferReport} companies={companies} sectors={allSectors} />;
        }
        return <AddReportChoice />;
      
      case 'risorse':
        return <ResourcesPage />;
      
      case 'report':
        const report = reports.find(r => r.id === param);
        if (!report) {
            window.location.hash = '#/';
            return null;
        }
        const isSupported = supportedReports.includes(report.id);
        if (report.type === ReportType.Experience) {
            return <ReportDetail report={report} onSupport={handleSupport} isSupported={isSupported} />;
        }
        if (report.type === ReportType.JobOffer) {
            return <JobOfferReportDetail report={report} onSupport={handleSupport} isSupported={isSupported} />;
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