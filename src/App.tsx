import React, { useState } from 'react';
import Header from './components/header';
import Nav from './components/nav';
import PositionSizeCalc from './components/positionSizeCalc';
import PnlCalc from './components/pnlCalc';

// CHAKRA UI
import { Box, Container, Grid, Stack, useColorMode } from '@chakra-ui/react';
// import ReactSelect from './fields/reactSelect';

function App() {
  const [pcMode, setPcmode] = useState(false);
  const [positionSizeMode, setPositionSizeMode] = useState(false);
  const [clipboardPrice, setclipboardPrice] = useState<number>();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Nav
        colorMode={colorMode}
        setPcmode={setPcmode}
        setPositionSizeMode={setPositionSizeMode}
        positionSizeMode={positionSizeMode}
        toggleColorMode={toggleColorMode}
        pcMode={pcMode}
      />
      <Container maxW={pcMode ? 'container.xl' : 'container.sm'} mb="4">
        <Box borderWidth="1px" borderRadius="lg" p="6">
          <Stack spacing="4">
            <Header setclipboardPrice={setclipboardPrice} />
            <Grid templateColumns={pcMode ? 'repeat(2, 2fr)' : ''} gap={6}>
              {!positionSizeMode ? (
                <PnlCalc pcMode={pcMode} clipboardPrice={clipboardPrice} />
              ) : (
                <PositionSizeCalc
                  clipboardPrice={clipboardPrice}
                  pcMode={pcMode}
                />
              )}
            </Grid>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default App;
