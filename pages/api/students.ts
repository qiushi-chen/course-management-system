import storage from '@/lib/service/storage';
import type { NextApiRequest, NextApiResponse } from 'next';
import auth_client from '../../infrastructure/auth.client';

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const {
    query: { name, id },
    method,
  } = req;
  const token = storage.token();
  console.log('queryapi', token, name, id, method);

  if (method === 'GET') {
    try {
      const data = await auth_client.getStuById(id[0]);
      console.log('==========', data);
      debugger;
      res.status(200).send(JSON.stringify({ data: data.data }));
    } catch (err) {
      console.error('user login failed error', err);
      res.status(401).send(JSON.stringify({ err }));
    }
  }
  res.status(200).send(JSON.stringify({ message: 'hello 200', id: id }));
};

export default handler;
