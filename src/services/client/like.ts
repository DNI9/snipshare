import { SITE_URL } from '~/constants';

type Result = {
  liked: boolean;
};

export const likeSnippet = async (
  id: string,
  onSuccess?: (data: Result) => void,
  onError?: (error: Error | any) => void
) => {
  try {
    const res = await fetch(`${SITE_URL}/api/snippet/like/${id}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to like/dislike snippet');
    const data: Result = await res.json();
    onSuccess?.(data);
  } catch (error) {
    onError?.(error);
  }
};
