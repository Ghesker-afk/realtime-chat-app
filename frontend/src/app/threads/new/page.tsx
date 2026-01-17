"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createBrowserApiClient } from "@/lib/api-client";
import { Category } from "@/types/thread";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";

// The idea with useMemo is that it allows us to "remember"
// a computed value between renders.

const NewThreadsSchema = z.object({
  title: z.string().trim().min(5, "Title is too short"),
  body: z.string().trim().min(15, "Body is too short"),
  categorySlug: z.string().trim().min(1, "Category is required") 
});

type NewThreadFormValues = z.infer<typeof NewThreadsSchema>;

function NewThreadsPage() {

  const {getToken} = useAuth();

  // useMemo is a hook that memoizes a value and returns
  // the same value until any of the dependencies in the
  // dependency array changes, until then it will recompute
  // a new value.

  const apiClient = useMemo(() => {
    createBrowserApiClient(getToken);
  }, [getToken]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewThreadFormValues>({
    resolver: zodResolver(NewThreadsSchema),
    defaultValues: {
      title: "",
      body: "",
      categorySlug: ""
    }
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Start a new thread</h1>
      </div>

      <Card className="border-border/70 bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Thread Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="title">
                Thread Title
              </label>

              <Input 
                id="title" 
                placeholder="Thread Title..."  
                {...form.register("title")} 
                disabled={isLoading || isSubmitting}
                className="mt-3 border-border bg-background/70 text-sm" 
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewThreadsPage;