import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not Allowed' });
  }

  const contactData = JSON.parse(req.body);

  const savedContact = await prisma.contact.create({
    data: contactData,
  });

  res.json(savedContact);
};
