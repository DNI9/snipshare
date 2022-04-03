import { HStack, Tag, TagLabel, TagRightIcon, Text } from '@chakra-ui/react';
import { BsArrowRightShort } from 'react-icons/bs';

import { NextLink } from '~/components/core';

type Props = {
  title: string;
  href?: string;
  actionTitle?: string;
};

export const TitleRow: React.FC<Props> = ({
  title,
  actionTitle = 'View all',
  href,
}) => {
  return (
    <HStack justify="space-between">
      <Text fontSize="lg">{title}</Text>
      {href && (
        <NextLink href={href}>
          <Tag size="sm" colorScheme="blackAlpha">
            <TagLabel fontSize={14}>{actionTitle}</TagLabel>
            <TagRightIcon as={BsArrowRightShort} />
          </Tag>
        </NextLink>
      )}
    </HStack>
  );
};
