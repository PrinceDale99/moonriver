import { getStory } from '@/lib/stories';
import { notFound } from 'next/navigation';
import StoryReader from './story-reader';
import { type Story } from '@/types';

// We can't use localStorage on the server, so this page needs to be dynamic.
// It will be rendered on the server for each request, but getStory will only
// return stories from the static list. The client-side StoryReader will
// handle stories from localStorage.
export const dynamic = 'force-dynamic';

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = getStory(params.id);

  // We can only check for static stories on the server.
  // The client will handle the case where the story is in localStorage.
  if (!story && typeof window === 'undefined') {
    // If not found, we don't call notFound() immediately,
    // because it might be a client-side story.
    // StoryReader will handle the "not found" case on the client.
  }

  return <StoryReader storyId={params.id} initialStory={story} />;
}
