/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Prisma } from '@prisma/client';

import { prisma } from '../src/lib/prisma';
import { codes } from './data';

const getRandomFromArray = <T = any>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

const snippetData: Prisma.SnippetCreateInput[] = [];

async function main() {
  codes.forEach(({ title, content, language, description }) => {
    snippetData.push({
      title,
      content,
      description,
      language,
      isPrivate: getRandomFromArray<boolean>([true, false]),
      user: { connect: { id: 'cl10yr8kl00107wacydab8cn5' } },
    });
  });

  for (const snippet of snippetData) {
    const res = await prisma.snippet.create({ data: snippet });
    console.log(`Snippet created: ${res.id}`);
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
