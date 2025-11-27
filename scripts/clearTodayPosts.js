const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearTodayPosts() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deleted = await prisma.postLog.deleteMany({
            where: {
                postedAt: {
                    gte: today,
                },
            },
        });

        console.log(`✅ Deleted ${deleted.count} post logs from today`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

clearTodayPosts();
