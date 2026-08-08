"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
};

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Registration failed. Please try again." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, username });

  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: "Failed to create your profile. Please try again." };
  }

  redirect("/");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
