import { SITE_URL } from '~/constants';

type Result = {
  deleted: boolean;
};

export const deleteSnippet = async (
  id: string,
  onSuccess?: (data: Result) => void,
  onError?: (error: Error | any) => void
) => {
  try {
    const res = await fetch(`${SITE_URL}/api/snippet?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete snippet');
    const data: Result = await res.json();
    onSuccess?.(data);
  } catch (error) {
    onError?.(error);
  }
};
