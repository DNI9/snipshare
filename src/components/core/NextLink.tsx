import { Link } from '@chakra-ui/react';
import NLink from 'next/link';

type Props = {
  children: React.ReactNode;
  href: string;
  linkProps?: React.ComponentProps<typeof Link>;
};

export const NextLink = ({ children, href, linkProps }: Props) => {
  return (
    <NLink href={href} passHref>
      <Link _hover={{ textDecor: 'none' }} {...linkProps}>
        {children}
      </Link>
    </NLink>
  );
};
