import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

type TMenuItems = {
  title: string;
  icon?: JSX.Element;
  onClick: () => void;
  hidden?: boolean;
};

type Props = {
  items: TMenuItems[];
};

export const CoreMenu: React.FC<Props> = ({ items, children }) => {
  return (
    <Menu placement="bottom-end">
      <MenuButton>{children}</MenuButton>
      <MenuList>
        {items.map(({ icon, onClick, title, hidden }) =>
          !hidden ? (
            <MenuItem key={title} icon={icon} onClick={onClick}>
              {title}
            </MenuItem>
          ) : null
        )}
      </MenuList>
    </Menu>
  );
};
