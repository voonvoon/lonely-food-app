// import { db } from "@/db";
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextResponse } from "next/server";

// export async function GET(req: NextApiRequest, res: NextApiResponse) {

//   if (!req.url) {
//     return res.status(400).json({ error: 'Invalid request URL' });
//   }
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   if (!id || typeof id !== 'string') {
//     return res.status(400).json({ error: 'Invalid image ID' });
//   }

//   try {
//     const image = await db.image.findUnique({
//       where: { id },
//     });

//     if (!image) {
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     return new NextResponse(Buffer.from(image.data), {
//         headers: { 'Content-Type': 'image/jpeg' }, // Adjust the content type as needed
//       });
//   } catch (error) {
//     console.error('Error retrieving image:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id || typeof id !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'Invalid image ID' }), { status: 400 });
  }

  try {
    const image = await db.image.findUnique({
      where: { id },
    });

    if (!image) {
      return new NextResponse(JSON.stringify({ error: 'Image not found' }), { status: 404 });
    }

    return new NextResponse(Buffer.from(image.data), {
      headers: { 'Content-Type': 'image/jpeg' }, // Adjust the content type as needed
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}