import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const project = await prisma.project.findUnique({
        where: { id, userId: session.user.id },
    });

    if (!project) redirect("/dashboard");

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="flex items-center text-2xl font-bold tracking-tight">
                        <Link href="/dashboard" className="text-gray-500 hover:text-cyan-400 transition-colors">
                            DASHBOARD
                        </Link>
                        <span className="mx-2 text-gray-700">/</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            {project.name}
                        </span>
                    </h1>
                    <nav className="flex space-x-4">
                        <Link
                            href={`/projects/${id}`}
                            className="rounded-md px-3 py-2 text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            SETTINGS
                        </Link>
                        <Link
                            href={`/projects/${id}/categories`}
                            className="rounded-md px-3 py-2 text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            CATEGORIES
                        </Link>
                        <Link
                            href={`/projects/${id}/logs`}
                            className="rounded-md px-3 py-2 text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            LOGS
                        </Link>
                        <Link
                            href="/help"
                            className="rounded-md px-3 py-2 text-sm font-bold text-cyan-500 hover:bg-gray-800 hover:text-cyan-400 transition-all"
                        >
                            HELP
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
