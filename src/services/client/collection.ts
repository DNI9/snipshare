import { SITE_URL } from '~/constants';
import { CollectionSchemaType } from '~/types/collection';

export const updateCollection = async (
  id: string,
  data: CollectionSchemaType
) => {
  const res = await fetch(`${SITE_URL}/api/collection?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('failed to update collection');
};
