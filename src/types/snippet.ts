import { Snippet, User } from '@prisma/client';

type Modify<T, R> = Omit<T, keyof R> & R;

export type SnippetWithLikes = Modify<
  Omit<Snippet, 'description' | 'userId' | 'collectionId'>,
  {
    createdAt: string;
    updatedAt: string;
    likedByCurrentUser: boolean;
    likes: Array<string>;
    isSnippetOwner?: boolean;
    user?: User;
    _count: { likes: number };
  }
>;
