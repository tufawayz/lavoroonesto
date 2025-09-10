import { createClient } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('Database environment variables are not set.');
      return res.status(500).json({ error: 'Server configuration error: Database credentials are not set.' });
    }

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

    const kv = createClient({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });

    await kv.del(`report:${id}`);
    
    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Error in delete handler:", error);
    return res.status(500).json({ error: 'Failed to delete report due to an unexpected server error.', details: error.message });
  }
}