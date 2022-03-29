import { Snippet, User } from '@prisma/client';
import { Object } from 'ts-toolbelt';

type Modify<T, R> = Omit<T, keyof R> & R;

export type SnippetWithLikes = Modify<
  Omit<Snippet, 'collectionId'>,
  {
    createdAt: string;
    updatedAt: string;
    likedByCurrentUser: boolean;
    likes: Array<string>;
    isSnippetOwner?: boolean;
    user?: Pick<User, 'id' | 'username' | 'name' | 'image'>;
    _count: { likes: number };
  }
>;

type SnippetOverwritten = Object.Overwrite<
  Omit<Snippet, 'collectionId'>,
  { createdAt: string; updatedAt: string }
>;

export type SnippetType = Object.Merge<
  SnippetOverwritten,
  {
    likedByCurrentUser: boolean;
    likes: Array<string>;
    isSnippetOwner?: boolean;
    user?: Pick<User, 'id' | 'username' | 'name' | 'image'>;
    _count: { likes: number };
  }
>;

export type SnippetData = {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  snippets: SnippetType[];
};
