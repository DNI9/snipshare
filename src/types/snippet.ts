import { Snippet, User } from '@prisma/client';

export type SnippetWithLikes = Snippet & {
  likedByCurrentUser: boolean;
  likes: Array<string>;
  isSnippetOwner?: boolean;
  user?: User;
  _count: { likes: number };
};
