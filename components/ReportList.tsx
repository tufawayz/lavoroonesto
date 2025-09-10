
import React from 'react';
import { Report, ReportType } from '../types';
import ReportCard from './ReportCard';
import JobOfferReportCard from './JobOfferReportCard';


interface ReportListProps {
  reports: Report[];
  onSupport: (id: string) => void;
  supportedReports: string[];
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onSupport, supportedReports, isAdmin, onDelete }) => {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
        <i className="fa-solid fa-folder-open text-6xl text-slate-300 mb-4"></i>
        <h3 className="text-2xl font-bold text-slate-700">Nessuna segnalazione trovata</h3>
        <p className="text-slate-500 mt-2">Sii il primo a condividere un'esperienza. La tua voce è importante.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {reports.map((report) => {
        const isSupported = supportedReports.includes(report.id);
        if (report.type === ReportType.Experience) {
          return <ReportCard key={report.id} report={report} onSupport={onSupport} isSupported={isSupported} isAdmin={isAdmin} onDelete={onDelete} />
        }
        if (report.type === ReportType.JobOffer) {
          return <JobOfferReportCard key={report.id} report={report} onSupport={onSupport} isSupported={isSupported} isAdmin={isAdmin} onDelete={onDelete} />
        }
        return null;
      })}
    </div>
  );
};

export default ReportList;