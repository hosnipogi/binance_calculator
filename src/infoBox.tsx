import React from 'react';
import { Box, Text, chakra } from '@chakra-ui/react';
import addComma from './utils/addCommaToNumber';

type T = {
  fontSize?: 'sm' | 'lg' | 'xl';
  margin: number;
  leverage: number;
  isChecked: boolean;
  pnl: {
    profit: number;
    loss: number;
    roe: {
      profit: number;
      loss: number;
    };
  };
};

const InfoBox = ({ margin, leverage, isChecked, pnl, fontSize = 'sm' }: T) => {
  return (
    <Box fontSize={fontSize} borderWidth="1px" borderRadius="lg" p="4">
      <Text>
        Initial Margin:{' '}
        <chakra.span fontWeight="bold">
          {addComma(margin / leverage)} USDT
        </chakra.span>
      </Text>
      {!isChecked ? (
        <Text>
          PNL:{' '}
          <chakra.span fontWeight="bold">
            {addComma(pnl.profit)} USDT
          </chakra.span>{' '}
        </Text>
      ) : (
        <>
          <Text>PNL TP: {addComma(pnl.profit)}</Text>
          <Text>PNL SL: {addComma(pnl.loss)}</Text>
        </>
      )}
      {!isChecked ? (
        <Text>
          ROE:{' '}
          <chakra.span fontWeight="bold">
            {addComma(pnl.roe.profit)} %
          </chakra.span>{' '}
        </Text>
      ) : (
        <>
          <Text>
            ROE-profit:{' '}
            <chakra.span fontWeight="bold">
              {addComma(pnl.roe.profit)} %
            </chakra.span>{' '}
          </Text>
          <Text>
            ROE-loss:{' '}
            <chakra.span fontWeight="bold">
              {addComma(pnl.roe.loss)} %
            </chakra.span>{' '}
          </Text>
        </>
      )}
    </Box>
  );
};

export default InfoBox;
