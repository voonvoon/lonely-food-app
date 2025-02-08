import { NextApiRequest, NextApiResponse } from 'next';

export default function(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process the payment data here
    const paymentData = req.body;

    // Redirect to the frontend page with payment data
    res.redirect(307, `/order-summary?status=success&data=${encodeURIComponent(JSON.stringify(paymentData))}`);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}