import { type Story } from "@/types";
import moonRiverHtml from './moonriver.html';

const stories: Story[] = [
  {
    id: "moon-river",
    title: "Moon River",
    author: "Prince Dale Limosnero",
    content: moonRiverHtml,
    isHtml: true,
    keywords: ["war", "romance", "germany"],
  },
  {
    id: "moby-dick",
    title: "Moby Dick",
    author: "Herman Melville",
    content: `Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietely take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me.`,
    keywords: ["sea", "whale", "adventure"],
  },
  {
    id: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.

“My dear Mr. Bennet,” said his lady to him one day, “have you heard that Netherfield Park is let at last?”

Mr. Bennet replied that he had not.

“But it is,” returned she; “for Mrs. Long has just been here, and she told me all about it.”

Mr. Bennet made no answer.

“Do not you want to know who has taken it?” cried his wife impatiently.

“You want to tell me, and I have no objection to hearing it.”

This was invitation enough.`,
    keywords: ["romance", "19th century", "england"],
  },
  {
    id: "the-great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    content: `In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.

“Whenever you feel like criticizing any one,” he told me, “just remember that all the people in this world haven’t had the advantages that you’ve had.”

He didn’t say any more, but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I’m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men. Most of the confidences were unsought—frequently I have feigned sleep, preoccupation, or a hostile levity when I realized by some unmistakable sign that an intimate revelation was quivering on the horizon; for the intimate revelations of young men, or at least the terms in which they express them, are usually plagiaristic and marred by obvious suppressions. Reserving judgements is a matter of infinite hope.`,
    keywords: ["jazz age", "america", "wealth"],
  },
  {
    id: "to-the-lighthouse",
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    content: `“Yes, of course, if it’s fine to-morrow,” said Mrs. Ramsay. “But you’ll have to be up with the lark,” she added.

To her son these words conveyed an extraordinary joy, as if it were settled, the expedition were bound to take place, and the wonder to which he had looked forward, for years and years it seemed, was, after a night’s darkness and a day’s sail, within touch. Since he belonged, even at the age of six, to that great clan which cannot keep this feeling separate from that, but must let future prospects, with their joys and sorrows, cloud what is actually at hand, since to such people even in earliest childhood any turn in the wheel of sensation has the power to crystallise and transfix the moment upon which its gloom or radiance rests, James Ramsay, sitting on the floor cutting out pictures from the illustrated catalogue of the Army and Navy stores, endowed the picture of a refrigerator, as his mother spoke, with heavenly bliss. It was fringed with joy. The wheel-barrow, the lawn-mower, the sound of poplar trees, leaves whitening before rain, rooks cawing, brooms knocking, dresses rustling—all these were so coloured and distinguished in his mind that he had already his private code, his secret language, though he appeared the normal child of six.`
  }
];

export function getStories(): Story[] {
  return stories;
}

export function getStory(id: string): Story | undefined {
  // We can't use localStorage on the server, so we'll just check the default stories.
  // The client-side version of this function will be in story-reader.tsx
  if (typeof window !== 'undefined') {
    const uploadedStories: Story[] = JSON.parse(localStorage.getItem("moon-river-stories") || "[]");
    return [...stories, ...uploadedStories].find((story) => story.id === id);
  }
  
  return stories.find((story) => story.id === id);
}