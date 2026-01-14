'use client';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  const displayNameValue = form.watch("displayName");
  const handleValue = form.watch("handle");
  const avatarUrlValue = form.watch("avatarUrl");

  return (
    <>
      <SignedOut>
        User is signed out
      </SignedOut>

      <SignedIn>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
          <div>
            <h1 className="flex items-center text-3xl font-bold tracking-tight text-foreground">
              <User className="w-8 h-8 text-primary" />
              Profile Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your profile information</p>
          </div>

          <Card className="border-border/70 bg-card">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                {
                  avatarUrlValue && 
                  <AvatarImage 
                    src={avatarUrlValue || "/placeholder.xyz"} 
                    alt={displayNameValue ?? ""} 
                  />
                }
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-2xl text-foreground">
                  {displayNameValue || "Your display name"}
                </CardTitle>
              </div>

              <div></div>
            </div>
          </CardHeader>
          </Card>
        </div>
      </SignedIn>
    </>
  );
}

export default ProfilePage;