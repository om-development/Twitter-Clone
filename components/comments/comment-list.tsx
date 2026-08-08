"use client";

import { useState } from "react";
import { deleteComment } from "@/lib/comments/actions";
import Timestamp from "@/components/timestamp";

export type PostComment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
};

const INITIAL_VISIBLE = 3;

export default function CommentList({
  comments,
  currentUserId,
}: {
  comments: PostComment[];
  currentUserId: string;
}) {
  const [showAll, setShowAll] = useState(false);

  if (comments.length === 0) {
    return null;
  }

  const visibleComments = showAll
    ? comments
    : comments.slice(0, INITIAL_VISIBLE);

  const hiddenCount = comments.length - INITIAL_VISIBLE;

  return (
    <div className="min-w-0">
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="min-w-0 py-3">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <span className="min-w-0 break-words text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {comment.profiles?.username ?? "Unknown"}
              </span>
              {comment.user_id === currentUserId ? (
                <form action={deleteComment} className="shrink-0">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-500 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </form>
              ) : null}
            </div>
            <p className="mt-1 break-words whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {comment.content}
            </p>
            <Timestamp
              date={comment.created_at}
              className="mt-1 text-xs text-zinc-400 dark:text-zinc-500"
            />
          </div>
        ))}
      </div>
      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-3 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {showAll
            ? "Show fewer comments"
            : `Show more comments (${hiddenCount})`}
        </button>
      ) : null}
    </div>
  );
}
