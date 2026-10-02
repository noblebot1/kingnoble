import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_CODE = process.env.ADMIN_CODE || '591900';

export function isAuthorized(req: VercelRequest): boolean {
    const codeHeader = req.headers['x-admin-code'];
    if (codeHeader && (Array.isArray(codeHeader) ? codeHeader[0] : codeHeader) === ADMIN_CODE) {
        return true;
    }
    return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-code');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (isAuthorized(req)) {
        return res.status(200).json({ success: true });
    }
    return res.status(401).json({ error: 'Unauthorized' });
}
