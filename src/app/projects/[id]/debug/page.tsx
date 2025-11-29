"use client";

import { use, useState, useEffect } from "react";

export default function DebugPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}/debug/schedule`);
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [id]);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Debug: Scheduled Posts</h1>
            <button onClick={fetchPosts} className="bg-blue-600 px-4 py-2 rounded mb-4">Refresh</button>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-4">
                    {posts.length === 0 ? <p>No scheduled posts found.</p> : null}
                    {posts.map((post) => (
                        <div key={post.id} className="border border-gray-700 p-4 rounded bg-gray-900">
                            <p><strong>ID:</strong> {post.id}</p>
                            <p><strong>Status:</strong> <span className={post.status === 'PENDING' ? 'text-yellow-400' : post.status === 'SUCCESS' ? 'text-green-400' : 'text-red-400'}>{post.status}</span></p>
                            <p><strong>Scheduled At (UTC):</strong> {post.scheduledAt}</p>
                            <p><strong>Scheduled At (Local):</strong> {new Date(post.scheduledAt).toLocaleString()}</p>
                            <p><strong>Category:</strong> {post.category?.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
