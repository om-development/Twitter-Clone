"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthFormState } from "@/lib/auth/actions";

const initialState: AuthFormState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    register,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Create your account
      </h1>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Username
          </span>
          <input
            type="text"
            name="username"
            placeholder="your_username"
            required
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </span>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
          />
        </label>

        {state.error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-900 transition-colors underline-offset-4 hover:underline dark:text-zinc-50"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
