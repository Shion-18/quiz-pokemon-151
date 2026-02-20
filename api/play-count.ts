import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
      const count = (await redis.get<number>(KEY)) ?? 0;
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      const current = (await redis.get<number>(KEY)) ?? 0;
      if (current >= MAX_COUNT) {
        return res.status(200).json({ count: current, capped: true });
      }
      const newCount = await redis.incr(KEY);
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('KV error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
