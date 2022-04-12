import { MenuItem, useColorMode } from '@chakra-ui/react';
import { BsFillSunFill } from 'react-icons/bs';
import { RiMoonClearFill } from 'react-icons/ri';

export const DarkModeMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <MenuItem
      closeOnSelect={false}
      icon={
        colorMode === 'light' ? (
          <RiMoonClearFill size={20} />
        ) : (
          <BsFillSunFill size={20} />
        )
      }
      onClick={toggleColorMode}
    >
      {colorMode === 'light' ? 'Dark' : 'Light'} theme
    </MenuItem>
  );
};
