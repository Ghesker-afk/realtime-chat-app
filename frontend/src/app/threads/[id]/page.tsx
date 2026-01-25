"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function ThreadsDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const router = useRouter();
  const {getToken} = useAuth();

  // we are going to store the thread details in a state.
  // we are going to handle the loading state (as usual).
  // we will render the current user handle (one more state).
  // and we are going to manage the comments (plus state).

  const [thread, setThread] = useState<thread>

  return (
    <div>Threads Details Page</div>
  );
}

export default ThreadsDetailsPage;