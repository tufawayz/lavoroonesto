
import React from 'react';
import type { ExperienceReport } from '../types';
import { BuildingIcon, HandshakeIcon, ShareIcon, TagIcon } from './icons/IconComponents';

interface ReportCardProps {
  report: ExperienceReport;
  onSupport: (id: string) => void;
  isSupported: boolean;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onSupport, isSupported, isAdmin, onDelete }) => {
    
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

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && window.confirm('Sei sicuro di voler eliminare questa segnalazione? L\'azione è irreversibile.')) {
            onDelete(report.id);
        }
    }

    const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col relative">
            {isAdmin && onDelete && (
                 <button 
                    onClick={handleDelete}
                    className="absolute top-3 right-3 z-10 bg-red-100 text-red-600 hover:bg-red-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    aria-label="Elimina segnalazione"
                    title="Elimina segnalazione"
                >
                    <i className="fa-solid fa-trash-can"></i>
                </button>
            )}
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">{report.sector}</span>
                    <span className="text-xs text-slate-500 pr-8">{timeAgo(report.createdAt)}</span>
                </div>
                 <a href={`#/report/${report.id}`} onClick={(e) => handleNav(e, `#/report/${report.id}`)} className="no-underline">
                    <h3 className="mt-4 text-xl font-bold text-slate-800 hover:text-sky-700">
                        {report.title}
                    </h3>
                </a>
                <div className="flex items-center mt-2 text-slate-600">
                    <BuildingIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{report.companyName}</span>
                </div>
                <p className="mt-4 text-slate-600 text-sm line-clamp-3">
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
                <div className="flex items-center space-x-3">
                    <a
                        href={`#/report/${report.id}`}
                        onClick={(e) => handleNav(e, `#/report/${report.id}`)}
                        className="text-sm font-medium text-sky-600 hover:underline"
                    >
                        Leggi di più
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;