import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAuthorized } from './auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Enable CORS for all incoming client requests
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-code, authorization'
    );

    // 2. Respond immediately to CORS preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. GET requests (viewing products) do not require passcode auth
    if (req.method === 'GET') {
        // ... Your database fetch logic here ...
        return res.status(200).json({ success: true, products: [] });
    }

    // 4. Authenticate POST / PUT / DELETE requests
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin passcode' });
    }

    // 5. Handle Product Creation (POST)
    if (req.method === 'POST') {
        try {
            const productData = req.body;
            // ... Insert product into Drizzle / Postgres DB ...
            return res.status(201).json({ success: true, message: 'Product added successfully', product: productData });
        } catch (err: any) {
            return res.status(500).json({ error: 'Database insertion error', details: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
