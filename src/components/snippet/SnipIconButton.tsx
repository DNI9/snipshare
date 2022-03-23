import { IconButtonProps, Tooltip, IconButton } from '@chakra-ui/react';

import { NextLink } from '~/components/core';

type SnipButtonProps = {
  href?: string;
  label: string;
  icon: React.ReactElement;
  iconButtonProps?: Partial<IconButtonProps>;
  onClick?: () => void;
};

export const SnipIconButton: React.FC<SnipButtonProps> = ({
  href,
  label,
  icon,
  iconButtonProps,
  onClick,
}) => {
  const button = (
    <Tooltip label={label} placement="top">
      <IconButton
        onClick={onClick}
        variant="ghost"
        aria-label={label}
        fontSize="lg"
        icon={icon}
        {...iconButtonProps}
      />
    </Tooltip>
  );

  return href ? <NextLink href={href}>{button}</NextLink> : button;
};
