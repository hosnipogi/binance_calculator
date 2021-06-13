import React, { useRef, useState, useEffect } from 'react';
import Field from './inputField';
import calculate from './utils/calculatePNL';
import getPrice from './utils/getPriceOfCoin';
import showPrice from './utils/showPrice';
import InfoBox from './infoBox';
import PositionSizeCal from './positionSizeCalc';

// CHAKRA UI
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  IconButton,
  chakra,
  Stack,
  HStack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MoonIcon,
  SunIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';

function App() {
  const [coin, setCoin] = useState<{ coin: string; price: string }[]>([]);
  const [entry, setEntry] = useState<number>(0);
  const [exit, setExit] = useState<number>(0);
  const [exitSL, setExitSL] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);
  const [timeSincePriceUpdated, setTimeSincePriceUpdate] = useState<number>(0);
  const [showInfo, toggleInfo] = useState(false);
  const [isLong, setIsLong] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [pcMode, setPcmode] = useState(false);
  const [clipboardPrice, setclipboardPrice] = useState<number>();

  const [positionSizeMode, setPositionSizeMode] = useState(false);

  const [pnl, setPnl] = useState({
    profit: 0,
    roe: { profit: 0, loss: 0 },
    margin: 0,
    loss: 0,
    err: {},
  });

  const coinRef = useRef<HTMLInputElement>(null);
  const entryRef = useRef<HTMLInputElement>(null);
  const exitRef = useRef<HTMLInputElement>(null);
  const exitSLRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const leverageRef = useRef<HTMLInputElement>(null);

  const margin = qty ? qty * (entry ? entry : 1) : 0;

  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    async function fetchCoinList() {
      const priceList = await getPrice();
      setCoin(priceList);
    }
    fetchCoinList();

    const count = setInterval(() => {
      setTimeSincePriceUpdate((t) => t + 1);
    }, 60000);

    return () => clearInterval(count);
  }, [setCoin]);

  useEffect(() => {
    setTimeSincePriceUpdate(0);
  }, [coin]);

  useEffect(() => {
    toggleInfo(false);
  }, [entry, exit]);

  return (
    <>
      <HStack my="4" justifyContent="flex-end" px="4">
        <IconButton
          aria-label="Toggle Position Size Mode"
          onClick={() => setPositionSizeMode(!positionSizeMode)}
          icon={positionSizeMode ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        />
        {window.innerWidth >= 800 && window.innerHeight >= 600 && (
          <IconButton
            aria-label="Toggle pc mode"
            onClick={() => setPcmode(!pcMode)}
            icon={pcMode ? <TriangleUpIcon /> : <TriangleDownIcon />}
          />
        )}
        <IconButton
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
      </HStack>
      <Container maxW={pcMode ? 'container.xl' : 'container.sm'} mb="4">
        <Grid templateColumns={pcMode ? 'repeat(2, 2fr)' : ''} gap={6}>
          <Stack spacing={4}>
            <Box borderWidth="1px" borderRadius="lg" p="6">
              <Stack spacing={6}>
                <HStack fontSize="sm" justifyContent="space-between">
                  <Text>
                    Last Price Update:{' '}
                    <chakra.span
                      color={timeSincePriceUpdated > 4 ? 'tomato' : 'default'}
                    >
                      {timeSincePriceUpdated} minute/s ago..
                    </chakra.span>
                  </Text>
                  <Button
                    size="sm"
                    alignSelf="flex-end"
                    onClick={async () => {
                      try {
                        const updatedPriceList = await getPrice();
                        setCoin(updatedPriceList);
                        const selectedCoin = updatedPriceList.find(
                          ({ coin }: { coin: string }) =>
                            coin === coinRef.current?.value
                        );
                        setclipboardPrice(selectedCoin?.price);
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                  >
                    Update Price
                  </Button>
                </HStack>
                <Field
                  type="select"
                  placeholder="Coin"
                  reference={coinRef}
                  func={(coinName: string) => ({
                    coinPrice: showPrice(coin, coinName),
                    clipboard: setclipboardPrice,
                  })}
                  value={coin}
                />
                {!positionSizeMode ? (
                  <>
                    <HStack>
                      <Button
                        w="50%"
                        onClick={() => {
                          setIsLong(true);
                          toggleInfo(false);
                        }}
                        bgColor={isLong ? 'green.400' : 'default'}
                        color={isLong ? 'white' : 'default'}
                        _hover={{ bgColor: 'green.400' }}
                      >
                        Long
                      </Button>
                      <Button
                        w="50%"
                        onClick={() => {
                          setIsLong(false);
                          toggleInfo(false);
                        }}
                        bgColor={!isLong ? 'red.400' : 'default'}
                        color={!isLong ? 'white' : 'default'}
                        _hover={{ bgColor: 'red.400' }}
                      >
                        Short
                      </Button>
                    </HStack>
                    <Field
                      type="range"
                      func={setLeverage}
                      reference={leverageRef}
                      value={leverage}
                      placeholder="Leverage"
                    />
                    <HStack justifyContent="space-between" fontSize="sm">
                      <Checkbox
                        fontSize="x-small"
                        onChange={() => setIsChecked(!isChecked)}
                      >
                        <Text fontSize="sm">TP/SL</Text>
                      </Checkbox>
                      <HStack>
                        <Button
                          size="sm"
                          onClick={async () => {
                            clipboardPrice &&
                              !isNaN(+clipboardPrice) &&
                              setEntry(clipboardPrice);
                          }}
                        >
                          Paste Current Price
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEntry(0);
                            setExit(0);
                            setQty(0);
                          }}
                        >
                          Clear
                        </Button>
                      </HStack>
                    </HStack>
                    <Field
                      value={entry as number}
                      placeholder="Entry Price"
                      reference={entryRef}
                      func={setEntry}
                    />

                    {isChecked ? (
                      <>
                        <Field
                          value={exit as number}
                          placeholder="Take Profit"
                          reference={exitRef}
                          func={setExit}
                        />
                        <Field
                          value={exitSL as number}
                          placeholder="Stop Loss"
                          reference={exitSLRef}
                          func={setExitSL}
                        />
                      </>
                    ) : (
                      <Field
                        value={exit as number}
                        placeholder="Exit Price"
                        reference={exitRef}
                        func={setExit}
                      />
                    )}
                    <Field
                      value={qty as number}
                      placeholder="Quantity"
                      reference={qtyRef}
                      func={setQty}
                    />

                    <Button
                      bgColor="orange.400"
                      color="white"
                      _hover={{ bgColor: 'orange.600' }}
                      onClick={() => {
                        if (
                          entry &&
                          qty &&
                          (exit || (isChecked && exit && exitSL))
                        ) {
                          const result = calculate({
                            entry,
                            exit,
                            exitSL,
                            qty,
                            leverage,
                            isLong,
                          });

                          console.log(result);
                          if (result.err) {
                            alert(JSON.stringify(result.err.message));
                            return;
                          }

                          setPnl(result);
                          toggleInfo(true);
                        }
                      }}
                      disabled={!entry || !exit || !qty}
                    >
                      Calculate
                    </Button>

                    {showInfo && entry && exit && qty && !pcMode && (
                      <InfoBox
                        margin={margin}
                        leverage={leverage}
                        pnl={pnl}
                        isChecked={isChecked}
                      />
                    )}
                  </>
                ) : (
                  <PositionSizeCal
                    coinPrice={clipboardPrice ? clipboardPrice : 0}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          {pcMode && (
            <InfoBox
              fontSize="xl"
              margin={margin}
              leverage={leverage}
              pnl={pnl}
              isChecked={isChecked}
            />
          )}
        </Grid>
      </Container>
    </>
  );
}

export default App;
