import { testApiHandler } from 'next-test-api-route-handler';
import { GET } from '../../../src/app/api/spotify/playlist/route';
import { getToken } from 'next-auth/jwt';

jest.mock('next-auth/jwt');

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('GET /api/spotify/playlist', () => {
  it('returns 401 when no valid token', async () => {
    mockedGetToken.mockResolvedValue(null as any);
    await testApiHandler({
      appHandler: { GET },
      url: 'http://example.com/api/spotify/playlist',
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        expect(res.status).toBe(401);
      },
    });
  });
});
