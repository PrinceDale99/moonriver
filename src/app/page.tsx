"use client";

import * as React from "react";
import Link from "next/link";
import { Book } from "lucide-react";
import { type Story } from "@/types";
import { getStories } from "@/lib/stories";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [story] = React.useState<Story | undefined>(() => {
    const stories = getStories();
    return stories.length > 0 ? stories[0] : undefined;
  });

  if (!story) {
    return (
      <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Story not found</h2>
          <p className="text-muted-foreground mt-2">
            The story could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="w-full">
        <Card className="transition-all duration-300 hover:shadow-lg bg-card">
           <Link href={`/story/${story.id}`} legacyBehavior>
            <a className="block">
              <CardHeader>
                <CardTitle className="font-headline tracking-tight flex items-start gap-4">
                  <Book className="h-8 w-8 shrink-0 text-primary mt-1" />
                  <span className="text-3xl">{story.title}</span>
                </CardTitle>
                <CardDescription className="pl-12">by {story.author}</CardDescription>
              </CardHeader>
              <CardContent className="pl-12">
                <p className="text-muted-foreground line-clamp-4">
                   {story.isHtml ? "A story of love, war, and the relentless flow of time." : `${story.content.substring(0, 200)}...`}
                </p>
              </CardContent>
            </a>
          </Link>
          <div className="p-6 pt-0 pl-12">
             <Link href={`/story/${story.id}`}>
              <Button size="lg">Read Story</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}