import { createClient, VercelKV } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Report, ExperienceReport, JobOfferReport } from '../types';
import { TOP_COMPANIES, SECTORS } from '../constants';

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