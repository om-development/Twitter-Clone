"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_POST_LENGTH = 280;

export type PostFormState = {
  error?: string;
  success?: boolean;
};

export async function createPost(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const content = String(formData.get("content") ?? "").trim();

  if (content.length === 0) {
    return { error: "Post cannot be empty." };
  }

  if (content.length > MAX_POST_LENGTH) {
    return { error: `Post cannot exceed ${MAX_POST_LENGTH} characters.` };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post." };
  }

  const { error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content });

  if (error) {
    return { error: "Failed to create your post. Please try again." };
  }

  revalidatePath("/");

  return { success: true };
}

export async function deletePost(formData: FormData) {
  const postId = String(formData.get("postId") ?? "");

  if (!postId) {
    return;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("posts").delete().eq("id", postId);

  revalidatePath("/");
}
