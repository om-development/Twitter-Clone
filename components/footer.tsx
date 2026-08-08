export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-4 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center px-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Om Dhakal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
