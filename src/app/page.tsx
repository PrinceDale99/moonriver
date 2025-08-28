"use client";

import * as React from "react";
import Link from "next/link";
import { type Story } from "@/types";
import { getStories } from "@/lib/stories";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Star } from "lucide-react";

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
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] text-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1), transparent 40%),
            radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.1), transparent 40%)
          `,
        }}
      />
      <div className="max-w-2xl w-full z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-foreground">
          {story.title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl md:text-2xl text-muted-foreground">
          by {story.author}
        </p>
        <p className="mt-8 max-w-xl mx-auto text-base sm:text-lg text-foreground/80">
          Enjoy reading
        </p>
        <div className="mt-12">
          <Link href={`/story/${story.id}`}>
            <Button size="lg" className="text-lg h-12 px-10">
              Begin Reading
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="https://docs.google.com/document/d/1PilTyVVG9WlX2lFtyyLLgXFhiwpxvX6evOlJiLOSQ_o/edit?usp=drivesdk" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View in Docs
            </Button>
          </Link>
          <Link href="https://codly.com/p/YpT2tEr" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Give a Review
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
