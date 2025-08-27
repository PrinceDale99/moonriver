"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type Story } from "@/types";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronLeft, ChevronRight, Cog, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getStories } from "@/lib/stories";

// Client-side only version of getStory
function getStoryFromBrowser(id: string): Story | undefined {
  const defaultStories = getStories();
  const uploadedStories: Story[] = JSON.parse(localStorage.getItem("moon-river-stories") || "[]");
  return [...defaultStories, ...uploadedStories].find((story) => story.id === id);
}

type ReadingSettings = {
  fontSize: number;
  lineHeight: number;
  theme: "light" | "sepia" | "dark";
};

const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

export default function StoryReader({ storyId, initialStory }: { storyId: string, initialStory: Story | undefined }) {
  const router = useRouter();
  const [story, setStory] = React.useState<Story | null | undefined>(initialStory);
  const [settings, setSettings] = React.useState<ReadingSettings>({
    fontSize: 18,
    lineHeight: 1.7,
    theme: "light",
  });
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [chapterElements, setChapterElements] = React.useState<HTMLElement[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);

  React.useEffect(() => {
    // If the story wasn't found on the server, try to find it on the client
    // (from localStorage).
    if (!initialStory) {
      const storyFromClient = getStoryFromBrowser(storyId);
      setStory(storyFromClient);
    }
    
    // If it's still not found after checking client-side, redirect.
    if (!initialStory && !getStoryFromBrowser(storyId)) {
        setTimeout(() => router.push('/'), 1000);
    }
    
    const savedSettings = localStorage.getItem("moon-river-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [storyId, router, initialStory]);

  React.useEffect(() => {
    localStorage.setItem("moon-river-settings", JSON.stringify(settings));
  }, [settings]);

  React.useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl && story) {
      const savedPosition = localStorage.getItem(`moon-river-bookmark-${story.id}`);
      if (savedPosition) {
        contentEl.scrollTop = parseFloat(savedPosition);
      }
      
      const chapterNodes = Array.from(contentEl.querySelectorAll('h2'));
      setChapterElements(chapterNodes);
    }
  }, [story]);

  const saveScrollPosition = useDebounce((scrollTop: number) => {
    if (story) {
      localStorage.setItem(`moon-river-bookmark-${story.id}`, String(scrollTop));
    }
  }, 500);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    saveScrollPosition(e.currentTarget.scrollTop);
    
    const contentEl = e.currentTarget;
    const { scrollTop, clientHeight } = contentEl;
    const scrollCenter = scrollTop + clientHeight / 2;

    const currentChapter = chapterElements.findIndex((chapterEl, index) => {
        const nextChapterEl = chapterElements[index + 1];
        if (nextChapterEl) {
            return scrollCenter >= chapterEl.offsetTop && scrollCenter < nextChapterEl.offsetTop;
        }
        return scrollCenter >= chapterEl.offsetTop;
    });

    if (currentChapter !== -1 && currentChapter !== currentChapterIndex) {
        setCurrentChapterIndex(currentChapter);
    }
  };
  
  const scrollToChapter = (index: number) => {
    const chapterEl = chapterElements[index];
    if(chapterEl && contentRef.current) {
        contentRef.current.scrollTo({
            top: chapterEl.offsetTop - 50, // a little offset from the top
            behavior: 'smooth'
        });
        setCurrentChapterIndex(index);
    }
  };

  const themeClasses = {
    light: "bg-[#FDF6E3] text-[#586E75]",
    sepia: "bg-[#FBF0D9] text-[#5B4636]",
    dark: "bg-[#1E1E1E] text-[#D4D4D4]",
  };

  if (story === undefined) {
    // Story not found, will redirect
    return (
        <div className="container max-w-3xl mx-auto p-4 sm:p-8">
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Story not found</h2>
                <p className="text-muted-foreground mt-2">Redirecting you to the library...</p>
            </div>
        </div>
    );
  }

  if (story === null) {
      // Loading state
    return (
        <div className="container max-w-3xl mx-auto p-4 sm:p-8">
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-3 mt-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </div>
    );
  }

  const hasChapters = chapterElements.length > 0;

  return (
    <div className={cn("fixed inset-0 z-50 transition-colors duration-300", themeClasses[settings.theme])}>
      <div
        ref={contentRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto"
        style={{
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
        }}
      >
        <div className="container max-w-3xl mx-auto p-4 sm:p-8 lg:py-24">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mb-2" style={{ lineHeight: 1.2 }}>
                {story.title}
            </h1>
            <p className="text-lg sm:text-xl text-current/70 mb-12">by {story.author}</p>
            {story.isHtml ? (
              <div className="prose-styles" dangerouslySetInnerHTML={{ __html: story.content }} />
            ) : (
              <div className="whitespace-pre-wrap font-body">
                {story.content}
              </div>
            )}
        </div>
      </div>

      <div className="fixed top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="fixed top-4 right-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Cog className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none font-headline">Appearance</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your reading experience.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({...s, fontSize: Math.max(10, s.fontSize - 1)}))}><Minus className="h-4 w-4" /></Button>
                    <span className="w-12 text-center text-sm">{settings.fontSize}px</span>
                     <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSettings(s => ({...s, fontSize: Math.min(32, s.fontSize + 1)}))}><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                   <Label htmlFor="lineHeight">Line Height</Label>
                   <Slider
                    id="lineHeight"
                    min={1.2}
                    max={2.2}
                    step={0.1}
                    value={[settings.lineHeight]}
                    onValueChange={(val) => setSettings(s => ({ ...s, lineHeight: val[0] }))}
                    className="col-span-2"
                   />
                </div>
                 <div className="grid grid-cols-1 items-center gap-4">
                   <Label htmlFor="theme" className="mb-2">Theme</Label>
                   <ToggleGroup type="single" value={settings.theme} onValueChange={(val: ReadingSettings["theme"]) => val && setSettings(s => ({ ...s, theme: val }))}>
                        <ToggleGroupItem value="light" aria-label="Light theme" className="flex-1">Light</ToggleGroupItem>
                        <ToggleGroupItem value="sepia" aria-label="Sepia theme" className="flex-1">Sepia</ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark theme" className="flex-1">Dark</ToggleGroupItem>
                   </ToggleGroup>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

       {hasChapters && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToChapter(currentChapterIndex - 1)}
            disabled={currentChapterIndex === 0}
            className="rounded-full backdrop-blur-sm bg-black/10 hover:bg-black/20"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous Chapter</span>
          </Button>
          <span className="text-sm tabular-nums px-3 py-1.5 rounded-full backdrop-blur-sm bg-black/10">
            Chapter {currentChapterIndex + 1} / {chapterElements.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToChapter(currentChapterIndex + 1)}
            disabled={currentChapterIndex === chapterElements.length - 1}
            className="rounded-full backdrop-blur-sm bg-black/10 hover:bg-black/20"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next Chapter</span>
          </Button>
        </div>
      )}
    </div>
  );
}
