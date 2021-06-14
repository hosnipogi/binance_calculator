import React, { useEffect, useState, useRef } from 'react';
import {
  HStack,
  Button,
  Text,
  Checkbox,
  Stack,
  Box,
  chakra,
} from '@chakra-ui/react';
import Field from './inputField';
import addComma from '../utils/addCommaToNumber';
import roundOff from '../utils/roundOff';

type T = {
  clipboardPrice: number | undefined;
  pcMode: boolean;
};

const PnlCalc = ({ clipboardPrice, pcMode }: T) => {
  const [entry, setEntry] = useState<number>(0);
  const [exit, setExit] = useState<number>(0);
  const [exitSL, setExitSL] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);
  const [leverage, setLeverage] = useState<number>(1);
  const [isLong, setIsLong] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [showInfo, toggleInfo] = useState(false);
  const [pnl, setPnl] = useState({
    profit: 0,
    roe: { profit: 0, loss: 0 },
    margin: 0,
    loss: 0,
    err: {},
  });

  const entryRef = useRef<HTMLInputElement>(null);
  const exitRef = useRef<HTMLInputElement>(null);
  const exitSLRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const leverageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    toggleInfo(false);
  }, [entry, exit]);

  const margin = qty ? qty * (entry ? entry : 1) : 0;

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={6}>
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
              if (entry && qty && (exit || (isChecked && exit && exitSL))) {
                const result = calculateProfit({
                  entry,
                  exit,
                  exitSL,
                  qty,
                  leverage,
                  isLong,
                });

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
        </Stack>
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
    </>
  );
};

export default PnlCalc;

const InfoBox = ({
  margin,
  leverage,
  isChecked,
  pnl,
  fontSize = 'sm',
}: {
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
}) => {
  const initMargin = margin / leverage;
  return (
    <Box fontSize={fontSize} borderWidth="1px" borderRadius="sm" p="4">
      <Text>
        Initial Margin:{' '}
        <chakra.span fontWeight="bold">
          {initMargin > 0
            ? addComma(roundOff(initMargin, 2))
            : roundOff(initMargin, 5)}
          USDT
        </chakra.span>
      </Text>
      {!isChecked ? (
        <Text>
          PNL:{' '}
          <chakra.span fontWeight="bold">
            {addComma(roundOff(pnl.profit, 2))} USDT
          </chakra.span>{' '}
        </Text>
      ) : (
        <>
          <Text>PNL TP: {roundOff(pnl.profit, 2)}</Text>
          <Text>PNL SL: {roundOff(pnl.loss, 2)}</Text>
        </>
      )}
      {!isChecked ? (
        <Text>
          ROE:{' '}
          <chakra.span fontWeight="bold">
            {roundOff(pnl.roe.profit, 2)} %
          </chakra.span>{' '}
        </Text>
      ) : (
        <>
          <Text>
            ROE-profit:{' '}
            <chakra.span fontWeight="bold">
              {roundOff(pnl.roe.profit, 2)} %
            </chakra.span>{' '}
          </Text>
          <Text>
            ROE-loss:{' '}
            <chakra.span fontWeight="bold">
              {roundOff(pnl.roe.loss, 2)} %
            </chakra.span>{' '}
          </Text>
        </>
      )}
    </Box>
  );
};

function calculateProfit({
  entry,
  exit = 0,
  qty = 1,
  leverage,
  isLong = true,
  exitSL = 0,
}: {
  entry: number;
  exit: number;
  qty?: number;
  leverage: number;
  isLong?: boolean;
  exitSL?: number;
}) {
  try {
    if (exitSL && exitSL > exit && isLong)
      throw new Error('Stop loss cannot be greater than TP when long');

    if (exitSL && exitSL < exit && !isLong)
      throw new Error('Stop loss cannot be less than TP when short');

    const x = exit * qty;
    const e = entry * qty;

    const profit = exitSL ? x - e : isLong ? x - e : -1 * (x - e);
    const loss = exitSL ? exitSL * qty - e : 0;
    const amount = qty * entry;
    const margin = amount / leverage;
    const roe = {
      profit: Math.round((profit / margin) * 100),
      loss: Math.round((loss / margin) * 100),
    };

    return { profit, roe, margin, loss, err: null };
  } catch (e) {
    return {
      profit: 0,
      roe: { profit: 0, loss: 0 },
      margin: 0,
      loss: 0,
      err: e,
    };
  }
}
