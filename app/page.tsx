import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreatePostForm from "@/components/posts/create-post-form";
import PostCard, { type Post } from "@/components/posts/post-card";
import Navbar from "@/components/navbar";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, user_id, content, created_at, profiles(username), likes(user_id), comments(id, user_id, content, created_at, profiles(username))",
    )
    .order("created_at", { ascending: false })
    .order("created_at", { foreignTable: "comments", ascending: true });

  const feedPosts = (posts ?? []) as unknown as Post[];

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <CreatePostForm />

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Feed
        </h2>
        {feedPosts.length > 0 ? (
          feedPosts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              No posts yet.
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Be the first to share something with the community!
            </p>
          </div>
        )}
        </section>
        <section>
          
        </section>
      </main>
    </>
  );
}
