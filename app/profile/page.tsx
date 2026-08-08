import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostCard, { type Post } from "@/components/posts/post-card";
import EditProfileForm from "@/components/profile/edit-profile-form";
import Navbar from "@/components/navbar";
import Timestamp from "@/components/timestamp";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { count: postCount },
    { count: likesReceived },
    { data: posts },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, bio, created_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("likes")
      .select("post_id, posts!inner(user_id)", { count: "exact", head: true })
      .eq("posts.user_id", user.id),
    supabase
      .from("posts")
      .select(
        "id, user_id, content, created_at, profiles(username), likes(user_id), comments(id, user_id, content, created_at, profiles(username))",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .order("created_at", { foreignTable: "comments", ascending: true }),
  ]);

  const profilePosts = (posts ?? []) as unknown as Post[];

  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {profile?.username ?? "Unknown"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
        </div>

        <p className="mt-4 break-words whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
          {profile?.bio ?? "No bio yet."}
        </p>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Joined
          </span>{" "}
          <Timestamp
            date={profile?.created_at ?? user.created_at}
            format="date"
          />
        </p>

        <div className="mt-5 flex gap-10 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {postCount ?? 0}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {postCount === 1 ? "Post" : "Posts"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {likesReceived ?? 0}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Likes received
            </span>
          </div>
        </div>
      </section>

      <EditProfileForm
        username={profile?.username ?? ""}
        bio={profile?.bio ?? ""}
      />

      <section className="flex flex-col gap-5">
        {profilePosts.length > 0 ? (
          profilePosts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={user.id} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              You haven&apos;t posted anything yet.
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Share your first post from the Home page.
            </p>
          </div>
        )}
      </section>
      </main>
    </>
  );
}
