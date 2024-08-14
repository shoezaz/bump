import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';

import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<Response> {
  const userId = params.userId;
  if (!uuidValidate(userId)) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const [userImage] = await prisma.$transaction(
    [
      prisma.userImage.findFirst({
        where: { userId },
        select: {
          data: true,
          contentType: true,
          hash: true
        }
      })
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted
    }
  );

  if (!userImage || !userImage.data) {
    return new NextResponse(undefined, {
      status: 404,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const version = searchParams.get('v');
  if (version && version !== userImage.hash) {
    return new NextResponse(undefined, {
      status: 400,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse(userImage.data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': userImage.contentType ?? 'image/png',
      'Content-Length': userImage.data.length.toString()
    }
  });
}
