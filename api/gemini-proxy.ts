
// /api/gemini-proxy.ts
// Vercel Edge Function to securely proxy requests to the Google Gemini API and handle report data.
import { GoogleGenAI } from "@google/genai";
import { kv } from "@vercel/kv";
import type { Report } from '../types';
import { SECTORS, TOP_COMPANIES } from "../constants";

export const config = {
  runtime: 'edge', // Use the modern Edge runtime
};

async function jsonResponse(data: any, status: number = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured on the server.' }, 500);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const { action, payload } = await request.json();

    switch (action) {
      case 'advice': {
        const report = payload.report;
        const prompt = `Un utente ha segnalato l'azienda "${report.companyName}" nel settore "${report.sector}" per le seguenti ragioni: ${report.title}. La sua descrizione del problema è: "${report.description}". 
        Basandoti su questo, fornisci suggerimenti costruttivi e pratici su come i consumatori, altri lavoratori e la community possono agire. 
        Struttura la risposta in Markdown. Includi:
        - Un paragrafo su come diffondere consapevolezza in modo efficace.
        - Suggerimenti per trovare alternative etiche all'azienda (se applicabile).
        - Modi concreti per sostenere i lavoratori attuali o passati.
        Evita un linguaggio aggressivo. Sii propositivo e focalizzati su azioni realizzabili.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return jsonResponse({ text: response.text });
      }

      case 'getInitialData': {
        const reportKeys = await kv.keys('report:*');
        if (reportKeys.length === 0) {
            return jsonResponse({ reports: [], companies: [], sectors: [] });
        }
        const reports = await kv.mget(...reportKeys);
        const companies = await kv.smembers('companies');
        const sectors = await kv.smembers('sectors');
        return jsonResponse({ reports, companies, sectors });
      }

      case 'addReport': {
        const { report } : { report: Report } = payload;
        
        // Ensure createdAt is a valid date string before storing
        report.createdAt = new Date(report.createdAt);

        await kv.set(`report:${report.id}`, report);

        // Add company to set of companies if not a default one
        if (!TOP_COMPANIES.includes(report.companyName)) {
           await kv.sadd('companies', report.companyName);
        }

        // Add sector to set of sectors if not a default one
        if (!SECTORS.includes(report.sector)) {
            await kv.sadd('sectors', report.sector);
        }
        
        return jsonResponse({ success: true, id: report.id });
      }

      case 'supportReport': {
        const { id } = payload;
        const reportKey = `report:${id}`;
        const report: Report | null = await kv.get(reportKey);
        
        if (!report) {
            return jsonResponse({ error: 'Report not found' }, 404);
        }

        report.supportCount += 1;
        await kv.set(reportKey, report);
        
        return jsonResponse({ success: true, supportCount: report.supportCount });
      }

      case 'deleteReport': {
        const { id, adminPassword } = payload;
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword || adminPassword !== correctPassword) {
            return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        await kv.del(`report:${id}`);
        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ error: `Invalid action: ${action}` }, 400);
    }

  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return jsonResponse({ error: errorMessage, details: error.toString() }, 500);
  }
}