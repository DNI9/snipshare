import { Snippet, User } from '@prisma/client';
import { Object } from 'ts-toolbelt';

type SnippetOverwritten = Object.Overwrite<
  Snippet,
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
