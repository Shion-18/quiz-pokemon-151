// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Redis クライアントをモックする（vi.mock はファイル先頭に巻き上げられるため vi.hoisted を使う）
const { redisGet, redisIncr } = vi.hoisted(() => ({
  redisGet: vi.fn(),
  redisIncr: vi.fn(),
}));

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(() => ({ get: redisGet, incr: redisIncr })),
}));

const { default: handler } = await import('../play-count');

// VercelResponse の最小限のスタブ
const createRes = () => {
  const res = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: undefined as unknown,
    setHeader(key: string, value: string) {
      res.headers[key] = value;
    },
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
};

const callHandler = async (method: string) => {
  const res = createRes();
  await handler({ method } as VercelRequest, res as unknown as VercelResponse);
  return res;
};

describe('/api/play-count', () => {
  beforeEach(() => {
    redisGet.mockReset();
    redisIncr.mockReset();
  });

  it('GETは保存されたプレイ回数を返し、未設定なら0を返す', async () => {
    redisGet.mockResolvedValueOnce(1234);
    const res = await callHandler('GET');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ count: 1234 });
    expect(res.headers['Access-Control-Allow-Origin']).toBe('*');

    redisGet.mockResolvedValueOnce(null);
    const emptyRes = await callHandler('GET');
    expect(emptyRes.body).toEqual({ count: 0 });
  });

  it('POSTはプレイ回数をインクリメントして新しい値を返す', async () => {
    redisGet.mockResolvedValueOnce(3);
    redisIncr.mockResolvedValueOnce(4);

    const res = await callHandler('POST');

    expect(redisIncr).toHaveBeenCalledWith('play-count');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ count: 4 });
  });

  it('上限(65536)に達したらインクリメントせずcapped:trueを返す', async () => {
    redisGet.mockResolvedValueOnce(65536);

    const res = await callHandler('POST');

    expect(redisIncr).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ count: 65536, capped: true });
  });

  it('GET/POST/OPTIONS以外のメソッドは405を返す', async () => {
    const res = await callHandler('DELETE');

    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: 'Method not allowed' });
    expect(redisGet).not.toHaveBeenCalled();
    expect(redisIncr).not.toHaveBeenCalled();
  });
});
