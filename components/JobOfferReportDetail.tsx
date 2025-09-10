import React from 'react';
import type { JobOfferReport } from '../types';
import { BuildingIcon, HandshakeIcon, TagIcon, LinkIcon, DocumentTextIcon } from './icons/IconComponents';

interface JobOfferReportDetailProps {
  report: JobOfferReport;
  onSupport: (id: string) => void;
  isSupported: boolean;
}

const JobOfferReportDetail: React.FC<JobOfferReportDetailProps> = ({ report, onSupport, isSupported }) => {
    
    const formatCurrency = (amount?: number) => {
        if (typeof amount !== 'number') return 'N/D';
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
    }

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 sm:p-8">
        <a href="#/" onClick={(e) => handleNav(e, '#/')} className="mb-6 text-sm font-medium text-sky-600 hover:text-sky-800 flex items-center space-x-2">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Torna a tutte le segnalazioni</span>
        </a>

        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{report.sector}</span>
        
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">{report.jobTitle}</h1>
        
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-600">
            <div className="flex items-center">
                <BuildingIcon className="w-5 h-5 mr-2 text-slate-400" />
                <span>{report.companyName}</span>
            </div>
             <div className="flex items-center">
                <i className="fa-regular fa-user-circle w-5 h-5 mr-2 text-slate-400"></i>
                <span>Segnalato in forma anonima</span>
            </div>
        </div>

        {report.tags && report.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                <TagIcon className="w-4 h-4 text-slate-400" />
                {report.tags.map((tag, index) => (
                    <span key={index} className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        )}

        <div className="mt-8 prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800">
            <h3 className="font-bold">Motivazione della segnalazione</h3>
            <p>{report.description}</p>
        </div>

        <div className="mt-8 space-y-4">
             <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <i className="fa-solid fa-coins mr-2 text-emerald-500"></i>
                    Informazioni sulla RAL
                </h3>
                {report.ralIndicated ? (
                    <p className="mt-1 text-slate-600">RAL indicata nell'offerta: <span className="font-bold">{formatCurrency(report.ralAmount)}</span></p>
                ) : (
                    <p className="mt-1 text-slate-600">La RAL <span className="font-bold">non era indicata</span> nell'offerta.</p>
                )}
            </div>

            {report.offerLink && (
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <LinkIcon className="w-5 h-5 mr-2 text-sky-500"/>
                        Link all'offerta
                    </h3>
                    <a href={report.offerLink} target="_blank" rel="noopener noreferrer" className="mt-1 text-sky-600 hover:underline break-all">
                        {report.offerLink}
                    </a>
                </div>
            )}
            
            {report.fileDataUrl && report.fileName && (
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-purple-500"/>
                        Allegato
                    </h3>
                    {report.fileDataUrl.startsWith('data:image/') ? (
                        <a href={report.fileDataUrl} target="_blank" rel="noopener noreferrer" title={`Visualizza immagine: ${report.fileName}`}>
                            <img src={report.fileDataUrl} alt={`Allegato per ${report.jobTitle}`} className="mt-2 rounded-lg max-w-full h-auto border border-slate-200" />
                        </a>
                    ) : (
                         <a
                            href={report.fileDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={report.fileName}
                            className="inline-flex items-center space-x-2 mt-1 text-sm font-medium text-sky-600 hover:underline"
                        >
                            <DocumentTextIcon className="w-5 h-5" />
                            <span>Scarica allegato ({report.fileName})</span>
                        </a>
                    )}
                </div>
            )}
        </div>
      </div>
      
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-center">
        <button
            onClick={() => onSupport(report.id)}
            disabled={isSupported}
            className={`w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-3 text-white font-bold rounded-lg transition-colors shadow-lg ${
                isSupported 
                ? 'bg-emerald-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
        >
            <HandshakeIcon />
            <span>{isSupported ? 'Hai già mostrato supporto' : `Mostra il tuo supporto (${report.supportCount})`}</span>
        </button>
      </div>
    </div>
  );
};

export default JobOfferReportDetail;