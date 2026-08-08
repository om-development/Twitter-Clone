"use client";

import { useActionState } from "react";
import { createComment, type CommentFormState } from "@/lib/comments/actions";

const MAX_COMMENT_LENGTH = 280;

const initialState: CommentFormState = {};

export default function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState<
    CommentFormState,
    FormData
  >(createComment, initialState);

  return (
    <form action={formAction} className="flex min-w-0 max-w-full flex-col gap-2">
      <input type="hidden" name="postId" value={postId} />
      <textarea
        name="content"
        placeholder="Write a comment..."
        required
        maxLength={MAX_COMMENT_LENGTH}
        rows={2}
        className="w-full max-w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
      />
      <div className="flex items-center justify-between gap-3">
        {state.error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="ml-auto rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
        >
          {isPending ? "Commenting..." : "Comment"}
        </button>
      </div>
    </form>
  );
}
