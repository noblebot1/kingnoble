import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-ControlHere is the updated **`api/auth.ts`** code that handles authorization cleanly for Vercel, aligning with your frontend passcode **`591900`**.

### Updated `api/auth.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fallback passcode if ADMIN_CODE is not set in Vercel environment variables
const ADMIN_CODE = process.env.ADMIN_CODE || '591900';

export function isAuthorized(req: VercelRequest): boolean {
  const codeHeader = req.headers['x-admin-code'];
  const authHeader = req.headers['authorization'];

  // 1. Check custom x-admin-code header
  if (codeHeader && (Array.isArray(codeHeader) ? codeHeader[0] : codeHeader) === ADMIN_CODE) {
    return true;
  }

  // 2. Check Bearer token authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === ADMIN_CODE) {
      return true;
    }
  }

  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-code, authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (isAuthorized(req))
