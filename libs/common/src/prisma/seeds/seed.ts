import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.users.createMany({
    data: [
      {
        login: 'admin',
        password:
          '$2a$10$q59vIYxhdq27x0wabZArsed7uacTfeNDH0SFK8cdgtEDfhWMX.8Ha', //admin
        email: 'admin@gmail.com',
        role: 'ADMIN',
      },
      {
        login: 'testUser',
        password:
          '$2a$10$uL31jvE523rcb/mKFItzHek/AE6F9CSXJr5oUusgapMgIbo03VS32', //testUser
        email: 'testUser@gmail.com',
        role: 'USER',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.meetups.create({
    data: {
      title: 'meetup 1',
      description: 'description to meetup 1',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 1,
      tags: {
        create: [
          {
            tag: { create: { title: 'dev' } },
          },
          {
            tag: { create: { title: 'js' } },
          },
        ],
      },
    },
  });

  await prisma.meetups.create({
    data: {
      title: 'meetup 2',
      description: 'description to meetup 2',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 2,
      tags: {
        create: [
          {
            tag: { create: { title: 'nest' } },
          },
          {
            tag: { create: { title: 'ts' } },
          },
        ],
      },
    },
  });

  await prisma.meetups.create({
    data: {
      title: 'meetup 3',
      description: 'description to meetup 3',
      place: 'Vitebsk, Bogdan Khmelnitsky Street, 30',
      date: '12-12-2022 12:12:12',
      organizerId: 2,
      tags: {
        create: [
          {
            tag: { create: { title: 'database' } },
          },
          {
            tag: { create: { title: 'postgresql' } },
          },
        ],
      },
      members: { create: { userId: 1 } },
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
