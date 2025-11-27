import { prisma } from './prisma';

/**
 * 1日の投稿数制限をチェックする関数
 * @param projectId プロジェクトID
 * @returns 投稿可能なら true, 制限に達していたら false
 */
export async function checkDailyLimit(projectId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { postingRule: true },
    });

    if (!project || !project.postingRule) return false;

    const maxPosts = project.postingRule.maxPostsPerDay;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.postLog.count({
        where: {
            projectId: projectId,
            postedAt: {
                gte: today,
            },
            status: 'SUCCESS',
        },
    });

    return count < maxPosts;
}

/**
 * エラー時の再試行待ち時間を計算 (指数バックオフ)
 */
export function getRetryDelay(attempt: number): number {
    // 1回目: 1分, 2回目: 4分, 3回目: 9分...
    return Math.pow(attempt, 2) * 60 * 1000;
}
