import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { beforeEach } from 'vitest';

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>();

// Reset mocks between tests
beforeEach(() => {
  mockReset(prismaMock);
});

// Context creator for tRPC tests
export const createTestContext = () => ({
  prisma: prismaMock,
  session: null,
});

export type TestContext = ReturnType<typeof createTestContext>;