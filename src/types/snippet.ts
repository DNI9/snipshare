import { Snippet } from '@prisma/client';

export type SnippetWithLikes = Snippet & {
  likedByCurrentUser: boolean;
  likes: Array<string>;
};
