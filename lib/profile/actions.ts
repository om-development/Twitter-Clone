"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_BIO_LENGTH = 160;

export type ProfileFormState = {
  error?: string;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (username.length === 0) {
    return { error: "Username cannot be empty." };
  }

  if (bio.length > MAX_BIO_LENGTH) {
    return { error: `Bio cannot exceed ${MAX_BIO_LENGTH} characters.` };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to edit your profile." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, bio: bio.length === 0 ? null : bio })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: "Failed to update your profile. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/");

  redirect("/profile");
}
