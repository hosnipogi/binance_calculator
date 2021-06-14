import React from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MoonIcon,
  SunIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';

type T = {
  setPositionSizeMode: any;
  positionSizeMode: boolean;
  setPcmode: any;
  pcMode: boolean;
  toggleColorMode: any;
  colorMode: 'light' | 'dark';
};

const Nav = ({
  setPositionSizeMode,
  positionSizeMode,
  setPcmode,
  pcMode,
  toggleColorMode,
  colorMode,
}: T) => (
  <HStack my="4" justifyContent="flex-end" px="4">
    <IconButton
      aria-label="Toggle Position Size Mode"
      onClick={() => setPositionSizeMode(!positionSizeMode)}
      icon={positionSizeMode ? <TriangleUpIcon /> : <TriangleDownIcon />}
    />
    {window.innerWidth >= 800 && window.innerHeight >= 600 && (
      <IconButton
        aria-label="Toggle pc mode"
        onClick={() => setPcmode(!pcMode)}
        icon={pcMode ? <ArrowLeftIcon /> : <ArrowRightIcon />}
      />
    )}
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    />
  </HStack>
);

export default Nav;
