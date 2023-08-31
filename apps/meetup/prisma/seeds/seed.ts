import { PrismaClient } from '@prisma-meetup/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  await prisma.tags.create({
    data: {
      title: 'tag 1',
    },
  });

  await prisma.tags.create({
    data: {
      title: 'tag 2',
    },
  });

  await prisma.tags.create({
    data: {
      title: 'tag 3',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
