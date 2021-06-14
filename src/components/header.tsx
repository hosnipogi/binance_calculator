import React, { useState, useEffect, useRef } from 'react';
import { HStack, Text, chakra, Button, Stack } from '@chakra-ui/react';
import Field from './inputField';
import getPrice from '../utils/getPriceOfCoin';
import showPrice from '../utils/showPrice';

type T = {
  setclipboardPrice: any;
};

const Header = ({ setclipboardPrice }: T) => {
  const [coin, setCoin] = useState<{ coin: string; price: string }[]>([]);
  const [timeSincePriceUpdated, setTimeSincePriceUpdate] = useState<number>(0);

  const coinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchCoinList() {
      const priceList = await getPrice();
      // const options = priceList.map(({ coin }: { coin: string }) => ({
      //   value: coin,
      //   label: coin,
      // }));
      setCoin(priceList);
      // setReactSelectOptions(options);
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

  return (
    <Stack spacing="4">
      <HStack fontSize="sm" justifyContent="space-between">
        <Text>
          Last Price Update:{' '}
          <chakra.span color={timeSincePriceUpdated > 4 ? 'tomato' : 'default'}>
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
                ({ coin }: { coin: string }) => coin === coinRef.current?.value
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
    </Stack>
  );
};

export default Header;
