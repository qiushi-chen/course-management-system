import type { NextApiRequest, NextApiResponse } from 'next';
import auth_client from '../../infrastructure/auth.client';
import { User } from '@/domain/user.d';

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const { method } = req;

  if (method === 'POST') {
    const user = req.body as User;

    try {
      const data = await auth_client.login(user);
      res.status(200).send(JSON.stringify({ data }));
    } catch (err) {
      console.error('user login failed error', err);
      res.status(401).send(JSON.stringify({ err }));
    }
  }
};

export default handler;
