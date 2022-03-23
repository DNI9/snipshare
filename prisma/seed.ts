/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma } from '@prisma/client';

import { prisma } from '../src/lib/prisma';
import { codes } from './data';

const getRandomFromArray = <T = any>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

const USERS = [
  { name: 'dni9', id: 'cl10yr8kl00107wacydab8cn5' },
  { name: 'ind', id: 'cl13elwsb0357aoaca9nortaj' },
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
