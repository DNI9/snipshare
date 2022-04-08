import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

type TMenuItems = {
  title: string;
  icon?: JSX.Element;
  onClick: () => void;
};

type Props = {
  items: TMenuItems[];
};

export const CoreMenu: React.FC<Props> = ({ items, children }) => {
  return (
    <Menu>
      <MenuButton>{children}</MenuButton>
      <MenuList>
        {items.map(({ icon, onClick, title }) => (
          <MenuItem key={title} icon={icon} onClick={onClick}>
            {title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
