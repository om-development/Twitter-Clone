"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Timestamp({
  date,
  format = "datetime",
  className,
}: {
  date: string;
  format?: "datetime" | "date";
  className?: string;
}) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const d = new Date(date);
  const text = format === "date" ? d.toLocaleDateString() : d.toLocaleString();

  return (
    <time dateTime={date} className={className}>
      {isClient ? text : null}
    </time>
  );
}
