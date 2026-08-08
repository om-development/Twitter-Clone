"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createPost, type PostFormState } from "@/lib/posts/actions";

const MAX_POST_LENGTH = 280;

const initialState: PostFormState = {};

export default function CreatePostForm() {
  const [content, setContent] = useState("");
  const [prevSuccess, setPrevSuccess] = useState<boolean | undefined>();
  const [state, formAction, isPending] = useActionState<PostFormState, FormData>(
    createPost,
    initialState,
  );

  if (state.success !== prevSuccess) {
    setPrevSuccess(state.success);
    if (state.success) {
      setContent("");
    }
  }

  const isEmpty = content.trim().length === 0;

  return (
    <form
      action={formAction}
      className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        name="content"
        placeholder="What's happening?"
        maxLength={MAX_POST_LENGTH}
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-lg text-zinc-900 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
      />
      <div className="mt-4 flex items-center justify-end gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {content.length} / {MAX_POST_LENGTH}
        </span>
        <button
          type="submit"
          disabled={isPending || isEmpty}
          className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </div>
      {state.error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
