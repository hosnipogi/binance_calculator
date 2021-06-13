import React, { useRef, useState } from 'react';
import Field from './fields/input';
import { Button, Stack, Box, Text, HStack } from '@chakra-ui/react';

type T = {
  coinPrice: number;
};

const PositionSize = ({ coinPrice }: T) => {
  const [margin, setMargin] = useState(0);
  const [entry, setEntry] = useState(0);
  const [risk, setRisk] = useState(0);
  const [pnl, setPnl] = useState<{
    pnl: any;
    leveragedMultiplier: number;
    leveragedQty: number;
    percentOfAccountCapital: number;
  }>({
    pnl: {},
    leveragedMultiplier: 0,
    leveragedQty: 0,
    percentOfAccountCapital: 0,
  });
  const [distanceToInvalidation, setDistanceToInvalidation] = useState(0);
  const [distanceToTp, setDistanceToTp] = useState(0);

  const marginRef = useRef(null);
  const entryRef = useRef(null);
  const riskRef = useRef(null);
  const distanceToInvalidationRef = useRef(null);
  const distanceToTpRef = useRef(null);

  return (
    <Stack spacing="4">
      <HStack justifyContent="space-between">
        <Text>Position Size Calculator</Text>
        <HStack>
          <Button size="sm" onClick={() => setEntry(coinPrice)}>
            Paste Current Price
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEntry(0);
              setMargin(0);
              setRisk(0);
              setDistanceToInvalidation(0);
              setDistanceToTp(0);
            }}
          >
            Clear
          </Button>
        </HStack>
      </HStack>
      <Field
        placeholder="entry"
        func={setEntry}
        reference={entryRef}
        value={entry as number}
      />
      <Field
        placeholder="margin"
        func={setMargin}
        reference={marginRef}
        value={margin as number}
      />
      <Field
        placeholder="risk"
        func={setRisk}
        reference={riskRef}
        value={risk as number}
      />
      <Field
        placeholder="Distance To Invalidation"
        func={setDistanceToInvalidation}
        reference={distanceToInvalidationRef}
        value={distanceToInvalidation as number}
      />
      <Field
        placeholder="Distance To TP"
        func={setDistanceToTp}
        reference={distanceToTpRef}
        value={distanceToTp as number}
      />

      <Button
        onClick={() => {
          const res = calculate({
            risk,
            margin,
            distanceToInvalidation,
            distanceToTp,
            entry,
          });
          setPnl(res);
        }}
        bgColor="orange.400"
        color="white"
        _hover={{ bgColor: 'orange.600' }}
        disabled={!distanceToInvalidation || !distanceToTp || !entry || !margin}
      >
        Calculate Position Size
      </Button>
      {pnl.pnl.long && (
        <Stack spacing="6">
          <Box borderWidth="1px" borderRadius="lg" p="6">
            <Text>Allowed Leverage: {pnl.leveragedMultiplier}X</Text>
            <Text>Quantity: {pnl.leveragedQty}</Text>
            <Text>Gain: {pnl.pnl.long.gain}</Text>
            <Text>Loss: {pnl.pnl.long.loss}</Text>
            <Text>PNL: {pnl.pnl.long.pnl * 100}%</Text>
            <Text>R/R: {pnl.pnl.long.rr}</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p="6">
            <Text mb="4" fontWeight="bold">
              Long Position
            </Text>
            <Text>TP: {pnl.pnl.long.TP}</Text>
            <Text>SL: {pnl.pnl.long.SL}</Text>
            <Text>Liquidation Price: {pnl.pnl.long.liquidationPrice}</Text>
          </Box>
          <Box borderWidth="1px" borderRadius="lg" p="6">
            <Text mb="4" fontWeight="bold">
              Short Position
            </Text>
            <Text>TP: {pnl.pnl.short.TP}</Text>
            <Text>SL: {pnl.pnl.short.SL}</Text>
            <Text>Liquidation Price: {pnl.pnl.short.liquidationPrice}</Text>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default PositionSize;

function calculate({
  risk,
  distanceToInvalidation,
  distanceToTp,
  entry,
  margin,
}: {
  risk: number;
  distanceToInvalidation: number;
  distanceToTp: number;
  entry: number;
  margin: number;
}) {
  const dti = distanceToInvalidation / 100;
  const dtt = distanceToTp / 100;
  const e = +entry;
  const m = +margin;

  const percentOfAccountCapital = risk / m;
  const affordQty = m / e;

  const allowedLeverageAmount = risk / dti;
  const leveragedQty = allowedLeverageAmount / e;
  const leveragedMultiplier = leveragedQty / affordQty;

  const long: any = {};
  long.TP = e + e * dtt;
  long.SL = e - e * dti;
  long.gain = (long.TP - e) * leveragedQty;
  long.loss = (long.SL - e) * leveragedQty;
  long.liquidationPrice = (e * leveragedQty - m) / leveragedQty;
  long.rr = (long.gain / long.loss) * -1;
  long.pnl = long.gain / m;

  const short: any = {};
  short.TP = e - e * dtt;
  short.SL = e + e * dti;
  short.gain = (e - short.TP) * leveragedQty;
  short.loss = (e - short.SL) * leveragedQty;
  short.liquidationPrice = (e * leveragedQty + m) / leveragedQty;
  short.rr = (short.gain / short.loss) * -1;
  short.pnl = short.gain / m;

  return {
    pnl: { long, short },
    leveragedMultiplier,
    percentOfAccountCapital,
    leveragedQty,
  };
}
