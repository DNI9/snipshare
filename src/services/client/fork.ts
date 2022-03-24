import { InferType } from 'yup';

import { SITE_URL } from '~/constants';
import { SnippetSchema } from '~/schema/snippet';
import { SnippetWithLikes } from '~/types/snippet';

type Result = {
  forked?: boolean;
};

export const forkSnippet = async (
  snippet: SnippetWithLikes,
  onSuccess?: (data: Result) => void,
  onError?: (error: Error | any) => void
) => {
  const body: InferType<typeof SnippetSchema> = {
    title: snippet.title,
    content: snippet.content,
    language: snippet.language,
    isPrivate: snippet.isPrivate ?? false,
    description: snippet.description ?? '',
  };

  try {
    const res = await fetch(
      `${SITE_URL}/api/snippet/fork?snipId=${snippet.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error('Failed to like/dislike snippet');
    const data: Result = await res.json();
    onSuccess?.(data);
  } catch (error) {
    onError?.(error);
  }
};
