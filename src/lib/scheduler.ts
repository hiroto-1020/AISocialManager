import { prisma } from './prisma';

export async function scheduleDailyPosts() {
    const projects = await prisma.project.findMany({
        include: {
            postingRule: true,
            categories: true,
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const project of projects) {
        if (!project.postingRule || project.categories.length === 0) continue;

        // Check if posts are already scheduled for today
        const existingPostsCount = await prisma.scheduledPost.count({
            where: {
                projectId: project.id,
                scheduledAt: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });

        if (existingPostsCount > 0) {
            console.log(`[Scheduler] Posts already scheduled for project ${project.id} today.`);
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
                const date = new Date(today);
                date.setHours(hours, minutes, 0, 0);
                return date;
            });
        } else if (rule.postingMode === 'random') {
            // Random slots implementation (Simplified for MVP)
            // Just pick 3 random times between 9:00 and 21:00
            for (let i = 0; i < maxPosts; i++) {
                const date = new Date(today);
                const randomHour = 9 + Math.floor(Math.random() * 12); // 9 to 21
                const randomMinute = Math.floor(Math.random() * 60);
                date.setHours(randomHour, randomMinute, 0, 0);
                scheduledTimes.push(date);
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
