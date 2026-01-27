"use client";
import { createBrowserApiClient } from "@/lib/api-client";
import { Category } from "@/types/thread";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

function ThreadsHomePage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const apiClient = useMemo(() => createBrowserApiClient( getToken), [getToken]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // stop at 4:56:42

  return (
    <div>
      <Link href={"/threads/new"}>Add new thread</Link>
    </div>
  );
}

export default ThreadsHomePage;