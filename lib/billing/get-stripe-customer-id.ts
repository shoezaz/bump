import { prisma } from '@/lib/db/prisma';

export async function getStripeCustomerId(
  organizationId: string
): Promise<string | undefined> {
  let stripeCustomerId: string | undefined;

  const organization = await prisma.organization.findFirst({
    where: { id: organizationId },
    select: { stripeCustomerId: true }
  });

  if (organization) {
    stripeCustomerId = organization.stripeCustomerId;
  }

  return stripeCustomerId;
}
