import Link from "next/link";
import { logout } from "@/lib/auth/actions";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold text-zinc-900 transition-colors underline-offset-4 hover:underline dark:text-zinc-50"
        >
          Twitter Clone
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition-colors underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-zinc-500 transition-colors underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Profile
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
