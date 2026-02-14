import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const KEY = 'play-count';
const MAX_COUNT = 65536; // 2^16

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const count = (await kv.get<number>(KEY)) ?? 0;
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      const current = (await kv.get<number>(KEY)) ?? 0;
      if (current >= MAX_COUNT) {
        return res.status(200).json({ count: current, capped: true });
      }
      const newCount = await kv.incr(KEY);
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('KV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
