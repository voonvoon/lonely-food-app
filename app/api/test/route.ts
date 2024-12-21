// import {auth} from '@/auth';
// import { NextResponse } from 'next/server';

// export const GET = auth(function GET(req) {
//     if(req.auth) return NextResponse.json(req.auth);
//     return NextResponse.json({error: "No user found"}, {status: 401});
// })

import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = auth(async function GET(req) {
  if (req.auth) {
    return NextResponse.json(req.auth);
  }
  return NextResponse.json({ error: "No user found" }, { status: 401 });
});