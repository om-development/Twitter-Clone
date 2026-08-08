"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_COMMENT_LENGTH = 280;

export type CommentFormState = {
  error?: string;
};

export async function createComment(
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const postId = String(formData.get("postId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!postId) {
    return { error: "Missing post id." };
  }

  if (content.length === 0) {
    return { error: "Comment cannot be empty." };
  }

  if (content.length > MAX_COMMENT_LENGTH) {
    return {
      error: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to comment." };
  }

  const { error } = await supabase
    .from("comments")
    .insert({ user_id: user.id, post_id: postId, content });

  if (error) {
    return { error: "Failed to add your comment. Please try again." };
  }

  revalidatePath("/");

  return {};
}

export async function deleteComment(formData: FormData) {
  const commentId = String(formData.get("commentId") ?? "");

  if (!commentId) {
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("comments").delete().eq("id", commentId);

  revalidatePath("/");
}
