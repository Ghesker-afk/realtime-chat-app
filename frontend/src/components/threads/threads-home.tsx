"use client";
import Link from "next/link";

function ThreadsHomePage() {
  return (
    <div>
      <Link href={"/threads/new"}>Add new thread</Link>
    </div>
  );
}

export default ThreadsHomePage;