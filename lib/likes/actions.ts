"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type LikeFormState = {
  error?: string;
};

export async function toggleLike(
  _prevState: LikeFormState,
  formData: FormData,
): Promise<LikeFormState> {
  const postId = String(formData.get("postId") ?? "");

  if (!postId) {
    return { error: "Missing post id." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to like posts." };
  }

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);

    if (error) {
      return { error: "Failed to unlike the post." };
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: user.id, post_id: postId });

    if (error && error.code !== "23505") {
      return { error: "Failed to like the post." };
    }
  }

  revalidatePath("/");

  return {};
}
