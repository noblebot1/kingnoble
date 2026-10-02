import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from './auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-code, authorization'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Return products list
        return res.status(200).json([]);
    }

    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin passcode' });
    }

    if (req.method === 'POST') {
        try {
            // Process form / body data
            return res.status(200).json({ success: true });
        } catch (err: any) {
            return res.status(500).json({ error: err.message || 'Failed to create product' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
