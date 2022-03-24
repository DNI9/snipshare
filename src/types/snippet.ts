import { Snippet, User } from '@prisma/client';

type Modify<T, R> = Omit<T, keyof R> & R;

export type SnippetWithLikes = Modify<
  Omit<Snippet, 'userId' | 'collectionId' | 'sourceSnippetId'>,
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
