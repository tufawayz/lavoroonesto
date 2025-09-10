

import React from 'react';
import type { JobOfferReport } from '../types';
import { BuildingIcon, HandshakeIcon, TagIcon } from './icons/IconComponents';

interface JobOfferReportCardProps {
  report: JobOfferReport;
  onSupport: (id: string) => void;
  isSupported: boolean;
}

const JobOfferReportCard: React.FC<JobOfferReportCardProps> = ({ report, onSupport, isSupported }) => {
    
    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anni fa";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " mesi fa";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " giorni fa";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " ore fa";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minuti fa";
        return "pochi secondi fa";
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
    }
    
    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };


    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border-l-4 border-purple-500">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{report.sector}</span>
                    <span className="text-xs text-slate-500">{timeAgo(report.createdAt)}</span>
                </div>
                <a href={`#/report/${report.id}`} onClick={(e) => handleNav(e, `#/report/${report.id}`)} className="no-underline">
                    <h3 className="mt-4 text-xl font-bold text-slate-800 hover:text-sky-700">
                        {report.jobTitle}
                    </h3>
                </a>
                <div className="flex items-center mt-2 text-slate-600">
                    <BuildingIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{report.companyName}</span>
                </div>

                {report.ralIndicated ? (
                     <div className="mt-3 flex items-center text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                        <i className="fa-solid fa-coins mr-2"></i>
                        <span>RAL Indicata: {report.ralAmount ? formatCurrency(report.ralAmount) : 'N/D'}</span>
                    </div>
                ) : (
                    <div className="mt-3 flex items-center text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <i className="fa-solid fa-eye-slash mr-2"></i>
                        <span>RAL non indicata</span>
                    </div>
                )}
                
                <p className="mt-4 text-slate-600 text-sm line-clamp-2">
                    {report.description}
                </p>

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
                
                <div className="mt-4">
                {report.fileDataUrl && report.fileName && report.fileDataUrl.startsWith('data:image/') ? (
                     <a href={`#/report/${report.id}`} onClick={(e) => handleNav(e, `#/report/${report.id}`)} className="block mt-2 rounded-lg max-h-48 w-full object-cover border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden">
                        <img 
                            src={report.fileDataUrl} 
                            alt={`Anteprima per ${report.jobTitle}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </a>
                ) : null}
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                 <button
                    onClick={() => onSupport(report.id)}
                    disabled={isSupported}
                    className={`flex items-center space-x-2 text-slate-600 transition-colors ${
                        isSupported 
                        ? 'text-emerald-600 cursor-default' 
                        : 'hover:text-emerald-600'
                    }`}
                >
                    <HandshakeIcon className="w-5 h-5" />
                    <span className="font-semibold">{report.supportCount} Sostengono</span>
                </button>
                 <a
                    href={`#/report/${report.id}`}
                    onClick={(e) => handleNav(e, `#/report/${report.id}`)}
                    className="text-sm font-medium text-sky-600 hover:underline"
                >
                    Leggi di più
                </a>
            </div>
        </div>
    );
};

export default JobOfferReportCard;