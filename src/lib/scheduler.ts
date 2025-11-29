import { prisma } from './prisma';

export async function scheduleDailyPosts() {
    const projects = await prisma.project.findMany({
        include: {
            postingRule: true,
            categories: true,
        },
    });

    // Calculate "Today" in JST (UTC+9)
    const now = new Date();
    const jstOffset = 9 * 60 * 60 * 1000;
    const nowJST = new Date(now.getTime() + jstOffset);

    const year = nowJST.getUTCFullYear();
    const month = nowJST.getUTCMonth();
    const day = nowJST.getUTCDate();

    // Start of today in JST (which is yesterday 15:00 UTC)
    // We use this for querying existing posts
    const startOfTodayJST = new Date(Date.UTC(year, month, day, 0 - 9, 0, 0, 0));
    const endOfTodayJST = new Date(Date.UTC(year, month, day, 23 - 9, 59, 59, 999));

    for (const project of projects) {
        if (!project.postingRule || project.categories.length === 0) continue;

        // Check if posts are already scheduled for "Today JST"
        const existingPostsCount = await prisma.scheduledPost.count({
            where: {
                projectId: project.id,
                scheduledAt: {
                    gte: startOfTodayJST,
                    lte: endOfTodayJST,
                },
            },
        });

        if (existingPostsCount > 0) {
            console.log(`[Scheduler] Posts already scheduled for project ${project.id} today (JST).`);
            continue;
        }

        const rule = project.postingRule;
        const maxPosts = rule.maxPostsPerDay;
        let scheduledTimes: Date[] = [];

        if (rule.postingMode === 'fixed') {
            // Fixed times: "09:00,12:00,18:00"
            const times = rule.fixedTimes.split(',').filter(t => t.trim() !== '');
            scheduledTimes = times.slice(0, maxPosts).map(timeStr => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                // Convert JST time to UTC Date object
                // JST 09:00 -> UTC 00:00 (hours - 9)
                return new Date(Date.UTC(year, month, day, hours - 9, minutes, 0, 0));
            });
        } else if (rule.postingMode === 'random') {
            // Random slots implementation (Simplified for MVP)
            // Just pick 3 random times between 9:00 and 21:00 JST
            for (let i = 0; i < maxPosts; i++) {
                const randomHour = 9 + Math.floor(Math.random() * 12); // 9 to 21 (JST)
                const randomMinute = Math.floor(Math.random() * 60);
                // Convert JST to UTC
                scheduledTimes.push(new Date(Date.UTC(year, month, day, randomHour - 9, randomMinute, 0, 0)));
            }
            scheduledTimes.sort((a, b) => a.getTime() - b.getTime());
        }

        // Create ScheduledPost records
        for (const scheduledAt of scheduledTimes) {
            // Pick a random category
            const randomCategory = project.categories[Math.floor(Math.random() * project.categories.length)];

            await prisma.scheduledPost.create({
                data: {
                    projectId: project.id,
                    categoryId: randomCategory.id,
                    scheduledAt: scheduledAt,
                    status: 'PENDING',
                },
            });
        }
    }
}
