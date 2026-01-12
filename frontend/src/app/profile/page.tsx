'use client';
import { apiGet, createBrowserApiClient } from "@/lib/api-client";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";

const optionalText = z.string().transform(value => value.trim()).transform(value => (value === "" ? undefined : value)).optional();

const ProfileSchema = z.object({
  displayName: optionalText,
  handle: optionalText,
  bio: optionalText,
  avatarUrl: optionalText
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

type UserResponse = {
  id: number;
  clerkUserId: string;
  displayName: string | null;
  email: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

function ProfilePage() {
  // we will get the token using this method provided
  // by Clerk
  const {getToken} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const apiClient = useMemo(() => createBrowserApiClient(getToken), [getToken]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: "",
      handle: "",
      bio: "",
      avatarUrl: ""
    }
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile(){
      try {
        setIsLoading(true);

        const getUserInfo = await apiGet<UserResponse>(apiClient, "/api/me");

        if (!isMounted) {
          return;
        }

        form.reset({
          displayName: getUserInfo.displayName ?? "",
          handle: getUserInfo.handle ?? "",
          bio: getUserInfo.bio ?? "",
          avatarUrl: getUserInfo.avatarUrl ?? ""
        })
      } catch (err: any) {
        console.log(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
  }, [apiClient, form]);

  return (
    <div>Profile</div>
  );
}

export default ProfilePage;