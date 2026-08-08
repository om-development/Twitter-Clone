"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "@/lib/profile/actions";

const MAX_BIO_LENGTH = 160;

const initialState: ProfileFormState = {};

export default function EditProfileForm({
  username,
  bio,
}: {
  username: string;
  bio: string;
}) {
  const [editing, setEditing] = useState(false);
  const [bioValue, setBioValue] = useState(bio);
  const [state, formAction, isPending] = useActionState<
    ProfileFormState,
    FormData
  >(updateProfile, initialState);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setBioValue(bio);
          setEditing(true);
        }}
        className="w-full rounded-full border border-zinc-300 bg-white px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
      >
        Edit Profile
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Edit Profile
      </h2>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Username
          </span>
          <input
            type="text"
            name="username"
            defaultValue={username}
            required
            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Bio
          </span>
          <textarea
            name="bio"
            value={bioValue}
            onChange={(event) => setBioValue(event.target.value)}
            maxLength={MAX_BIO_LENGTH}
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50/15"
          />
          <span className="self-end text-sm text-zinc-500 dark:text-zinc-400">
            {bioValue.length} / {MAX_BIO_LENGTH}
          </span>
        </label>

        {state.error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={isPending}
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
