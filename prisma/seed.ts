/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma } from '@prisma/client';

import { prisma } from '../src/lib/prisma';
import { codes } from './data';

const getRandomFromArray = <T = any>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

const USERS = [
  { name: 'dni9', id: 'cl156kwp30016orachbjhixom' },
  { name: 'ind', id: 'cl156y37r0117orac0h4z7te5' },
];

async function main() {
  const { count } = await prisma.snippet.deleteMany({});
  console.log(`${count} snippets deleted`);

  for (const user of USERS) {
    const snippetData: Prisma.SnippetCreateInput[] = [];

    codes.forEach(({ title, content, language, description }) => {
      snippetData.push({
        title: `[${user.name}] ${title}`,
        content,
        description,
        language,
        isPrivate: getRandomFromArray<boolean>([true, false]),
        user: { connect: { id: user.id } },
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
