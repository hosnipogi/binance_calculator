import React, { RefObject, useEffect, useState } from 'react';
import { Select, Text } from '@chakra-ui/react';
import { T } from './types';
import addComma from '../utils/addCommaToNumber';

export default function SelectElement({ func, value, reference }: T) {
  const [coinPair, setCoinPair] = useState<{ coin: string; price: string }>();

  useEffect(() => {
    if (Array.isArray(value)) {
      const selectedCoin = value.find(
        ({ coin }) => coin === reference.current?.value
      );
      selectedCoin && setCoinPair(selectedCoin);
    }
  }, [value, reference]);

  return (
    <>
      <Select
        onChange={async () => {
          const res = func(reference.current?.value);
          const selectedCoin = res.coinPrice;
          const clipboard = res.clipboard;

          try {
            if (Array.isArray(value)) {
              const coinPrice = value.find(
                ({ coin }) => coin === selectedCoin.coin
              )?.price;
              coinPrice && clipboard(coinPrice);
            }
          } catch (e) {
            console.log(e);
          }
          setCoinPair(selectedCoin);
        }}
        ref={reference as RefObject<HTMLSelectElement>}
      >
        {Array.isArray(value) &&
          value.map((val, index) => (
            <option value={val.coin} key={index}>
              {val.coin}
            </option>
          ))}
      </Select>
      <Text fontSize="sm" textAlign="right">
        {coinPair?.price && addComma(+coinPair.price)} USDT ~ 1{' '}
        {coinPair?.coin.replace('USDT', '')}
      </Text>
    </>
  );
}
