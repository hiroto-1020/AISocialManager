import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearTodayPosts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deleted = await prisma.postLog.deleteMany({
        where: {
            postedAt: {
                gte: today,
            },
        },
    });

    console.log(`Deleted ${deleted.count} post logs from today`);
    await prisma.$disconnect();
}

clearTodayPosts().catch(console.error);
