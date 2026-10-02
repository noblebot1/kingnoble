import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../index'; // Ensure this points to your Drizzle DB instance
import { products } from '../schema'; // Ensure this points to your Drizzle schema
import { isAuthorized } from './auth';
import { put } from '@vercel/blob';

// Disable default Vercel body parser to handle file/form data streams
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-code, authorization'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Fetch all products (GET)
    if (req.method === 'GET') {
        try {
            const allProducts = await db.select().from(products);
            return res.status(200).json(allProducts);
        } catch (err: any) {
            return res.status(500).json({ error: 'Failed to fetch products', details: err.message });
        }
    }

    // 3. Verify Admin Passcode for Mutations
    if (!isAuthorized(req)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid passcode' });
    }

    // 4. Create Product (POST)
    if (req.method === 'POST') {
        try {
            // Read incoming form data
            const contentType = req.headers['content-type'] || '';
            
            // If handling standard JSON payload
            if (contentType.includes('application/json')) {
                const { title, price, category, description, image } = req.body;
                const newProduct = await db.insert(products).values({
                    title,
                    price: String(price),
                    category: category || 'General',
                    description: description || '',
                    image: image || '',
                }).returning();
                return res.status(200).json(newProduct[0]);
            }

            return res.status(400).json({ error: 'Unsupported Content-Type header' });
        } catch (err: any) {
            console.error('Database Insertion Error:', err);
            return res.status(500).json({ error: err.message || 'Failed to add product to database' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
