import { createClient, VercelKV } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- Inlined types.ts ---
type Sector = string;

enum ReportType {
  Experience = 'EXPERIENCE',
  JobOffer = 'JOB_OFFER',
}

interface BaseReport {
  id: string;
  companyName: string;
  createdAt: Date;
  supportCount: number;
}

interface ExperienceReport extends BaseReport {
  type: ReportType.Experience;
  title: string;
  description: string;
  sector: Sector;
  isAnonymous: boolean;
  authorName?: string;
  tags: string[];
  unkeptPromises?: string[];
}

interface JobOfferReport extends BaseReport {
  type: ReportType.JobOffer;
  jobTitle: string;
  sector: Sector;
  description: string;
  fileDataUrl?: string;
  fileName?: string;
  offerLink?: string;
  ralIndicated?: boolean;
  ralAmount?: number;
  tags: string[];
}

type Report = ExperienceReport | JobOfferReport;
// --- End Inlined types.ts ---


// --- Inlined constants.ts ---
const SECTORS: string[] = [
  "Vendita al dettaglio", "Vendita all'ingrosso", "E-commerce", "Agenti di commercio",
  "Ristoranti e bar", "Hotel e alberghi", "Catering e mense",
  "Trasporti e spedizioni", "Magazzino e stoccaggio", "Corrieri espressi (Rider)",
  "Servizi di pulizie", "Assistenza anziani e badanti", "Babysitter e colf",
  "Sviluppo software", "Consulenza IT", "Assistenza tecnica",
  "Costruzioni", "Impiantistica", "Manutenzione",
  "Call Center Inbound", "Call Center Outbound", "Telemarketing",
  "Agricoltura e Allevamento", "Sanità e Assistenza", "Marketing e Comunicazione", "Manifatturiero",
];

const TOP_COMPANIES: string[] = [
    "Accenture", "Adecco", "Amazon", "Apple", "Armani", "Barilla", "Bending Spoons", "Capgemini",
    "Coca-Cola", "Conad", "Coop", "Deloitte", "Diesel", "Enel", "Eni", "Esselunga", "EY (Ernst & Young)",
    "Ferrari", "Ferrero", "Fiat (Stellantis)", "Generali", "Google", "Gucci", "H&M", "IKEA", "Intesa Sanpaolo",
    "KPMG", "Lavazza", "Leonardo", "Lidl", "Luxottica", "Maire Tecnimont", "McDonald's", "Mediaset", "Microsoft",
    "Nestlé", "Oracle", "Pirelli", "Poste Italiane", "Prada", "PwC", "Rai", "Randstad", "Ryanair", "Salesforce",
    "Samsung", "SAP", "TIM", "UniCredit", "Unilever", "Vodafone", "Zara (Inditex)"
];
// --- End Inlined constants.ts ---


async function handleGetInitialData(kv: VercelKV, res: VercelResponse) {
    try {
        const reportKeys = await kv.keys('report:*');
        const reportsData = reportKeys.length > 0 ? (await kv.mget<Report[]>(...reportKeys)).filter(Boolean) as Report[] : [];

        const parsedReports = reportsData.map(report => ({
            ...report,
            createdAt: new Date(report.createdAt)
        }));
        
        const customCompanies = await kv.smembers('companies');
        const customSectorsFromDB = await kv.smembers('sectors');

        const companies = Array.from(new Set([...TOP_COMPANIES, ...customCompanies])).sort();
        const customSectors = customSectorsFromDB.sort();

        return res.status(200).json({ reports: parsedReports, companies, customSectors });
    } catch (error) {
        console.error("Error in handleGetInitialData:", error);
        return res.status(500).json({ error: "Failed to fetch initial data." });
    }
}

async function handleAddReport(kv: VercelKV, req: VercelRequest, res: VercelResponse) {
    try {
        const newReport: ExperienceReport | JobOfferReport = req.body.report;
        if (!newReport || !newReport.id) {
            return res.status(400).json({ error: 'Invalid report data' });
        }
        await kv.set(`report:${newReport.id}`, newReport);

        if (!TOP_COMPANIES.includes(newReport.companyName)) {
            await kv.sadd('companies', newReport.companyName);
        }
        if (!SECTORS.includes(newReport.sector)) {
            await kv.sadd('sectors', newReport.sector);
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in handleAddReport:", error);
        return res.status(500).json({ error: "Failed to add report." });
    }
}

async function handleSupportReport(kv: VercelKV, req: VercelRequest, res: VercelResponse) {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Missing report ID' });
        }
        const report = await kv.get<Report>(`report:${id}`);
        if(report) {
            report.supportCount += 1;
            await kv.set(`report:${id}`, report);
            return res.status(200).json({ success: true, supportCount: report.supportCount });
        } else {
            return res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        console.error("Error in handleSupportReport:", error);
        return res.status(500).json({ error: "Failed to support report." });
    }
}

async function handleDeleteReport(kv: VercelKV, req: VercelRequest, res: VercelResponse) {
  try {
    const { id, adminPassword } = req.body;

    if (!id || !adminPassword) {
      return res.status(400).json({ error: 'Missing report ID or admin password' });
    }

    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set on Vercel.');
      return res.status(500).json({ error: 'Server configuration error: Admin password not set.' });
    }

    if (adminPassword !== correctPassword) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect password' });
    }

    await kv.del(`report:${id}`);
    
    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Error in handleDeleteReport:", error);
    return res.status(500).json({ error: 'Failed to delete report due to an unexpected server error.', details: error.message });
  }
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            console.error('Database environment variables are not set.');
            return res.status(500).json({ error: 'Server configuration error: Database credentials are not set.' });
        }

        const kv = createClient({
          url: process.env.KV_REST_API_URL!,
          token: process.env.KV_REST_API_TOKEN!,
        });
        
        if (req.method === 'GET') {
            return await handleGetInitialData(kv, res);
        }
        
        if (req.method === 'POST') {
            const { action } = req.body;
            switch (action) {
                case 'addReport':
                    return await handleAddReport(kv, req, res);
                case 'supportReport':
                    return await handleSupportReport(kv, req, res);
                case 'deleteReport':
                    return await handleDeleteReport(kv, req, res);
                default:
                    return res.status(400).json({ error: 'Invalid action' });
            }
        }
        
        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (error: any) {
        console.error('Unhandled error in handler:', error);
        return res.status(500).json({ error: 'An unexpected server error occurred.', details: error.message });
    }
}