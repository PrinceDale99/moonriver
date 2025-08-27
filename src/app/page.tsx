"use client";

import * as React from "react";
import Link from "next/link";
import { Book, Search, Upload } from "lucide-react";
import { type Story } from "@/types";
import { getStories } from "@/lib/stories";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [stories, setStories] = React.useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const defaultStories = getStories();
    const uploadedStories: Story[] = JSON.parse(localStorage.getItem("moon-river-stories") || "[]");
    
    // Avoid duplicates on hot-reload in dev
    const allStories = [...defaultStories];
    const storyIds = new Set(defaultStories.map(s => s.id));
    uploadedStories.forEach(story => {
      if (!storyIds.has(story.id)) {
        allStories.push(story);
        storyIds.add(story.id);
      }
    });

    setStories(allStories);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain" || file.name.endsWith(".md") || file.type === "text/html" || file.name.endsWith(".html")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const isHtml = file.type === "text/html" || file.name.endsWith(".html");
          const newStory: Story = {
            id: `uploaded-${Date.now()}`,
            title: file.name.replace(/\.(txt|md|html)$/, ""),
            author: "You",
            content,
            isHtml: isHtml,
          };
          
          setStories(prevStories => {
            const uploaded = prevStories.filter(s => s.id.startsWith('uploaded'));
            const updatedUploaded = [...uploaded, newStory];
            localStorage.setItem("moon-river-stories", JSON.stringify(updatedUploaded));
            return [...getStories(), ...updatedUploaded];
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a .txt, .md, or .html file.",
        });
      }
    }
  };

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          Upload Story
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md,.html"
          className="hidden"
        />
      </div>

      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Link href={`/story/${story.id}`} key={story.id} legacyBehavior>
              <a className="block h-full">
                <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card">
                  <CardHeader>
                    <CardTitle className="font-headline tracking-tight flex items-start gap-3">
                      <Book className="h-6 w-6 shrink-0 text-primary mt-1" />
                      <span>{story.title}</span>
                    </CardTitle>
                    <CardDescription>by {story.author}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-4">
                      {story.isHtml ? "HTML Content" : `${story.content.substring(0, 200)}...`}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No stories found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or upload a new story.
          </p>
        </div>
      )}
    </div>
  );
}
