/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma } from '@prisma/client';

import { prisma } from '../src/lib/prisma';
import { codes } from './data';

const getRandomFromArray = <T = any>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

const USERS = [
  { name: 'dni9', id: 'cl1rzv252001874ac2xo9rvuy' },
  { name: 'ind', id: 'cl1s31vlw1551qsacqa0wlivv' },
];

const Collections: { title: string; description: string }[] = [
  { title: 'web stuffs', description: 'my web development snippets' },
  { title: 'backend', description: 'all of my backend snippets' },
];

async function main() {
  const { count } = await prisma.snippet.deleteMany({});
  const { count: collectionDeleteCount } = await prisma.collection.deleteMany(
    {}
  );

  console.log(`${count} snippets deleted`);
  console.log(`${collectionDeleteCount} collections deleted`);

  for (const user of USERS) {
    const snippetData: Prisma.SnippetCreateInput[] = [];
    const collectionIds: string[] = [];

    for (const { title, description } of Collections) {
      const res = await prisma.collection.create({
        data: {
          title,
          description,
          user: { connect: { id: user.id } },
        },
      });
      collectionIds.push(res.id);
      console.log(`Collection created: ${res.id}`);
    }

    codes.forEach(({ title, content, language, description }) => {
      snippetData.push({
        title: `[${user.name}] ${title}`,
        content,
        description,
        language,
        isPrivate: getRandomFromArray<boolean>([true, false]),
        user: { connect: { id: user.id } },
        collection: { connect: { id: getRandomFromArray(collectionIds) } },
      });
    });

    for (const snippet of snippetData) {
      const res = await prisma.snippet.create({ data: snippet });
      console.log(`Snippet created: ${res.id}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
