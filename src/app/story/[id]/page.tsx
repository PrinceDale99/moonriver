import { getStory } from '@/lib/stories';
import { notFound } from 'next/navigation';
import StoryReader from './story-reader';
import { type Story } from '@/types';

// We need to use a client-side function `localStorage` in getStory,
// so we can't easily make this page fully static.
// We set dynamic = 'force-dynamic' to ensure it's rendered on the server for each request.
export const dynamic = 'force-dynamic';

export default function StoryPage({ params }: { params: { id: string } }) {
  // This is a workaround because getStory needs localStorage.
  // In a real app with a DB, this would be a server-side fetch.
  // Since we can't access localStorage on the server, we'll pass the ID
  // and let the client component fetch the data.
  const storyId = params.id;

  return <StoryReader storyId={storyId} />;
}
