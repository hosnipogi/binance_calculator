import React, { useRef, useState } from 'react';
import Field from '../fields/input';
import { Box, Button, Stack, Text, HStack, Checkbox } from '@chakra-ui/react';
import roundOff from '../utils/roundOff';

type T = {
  clipboardPrice: number | undefined;
  pcMode: boolean;
};

const PositionSize = ({ clipboardPrice, pcMode }: T) => {
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
  const [leverageFactor, setLeverageFactor] = useState(0);
  const [roundOffLeverage, setRoundOffLeverage] = useState(true);

  const marginRef = useRef(null);
  const entryRef = useRef(null);
  const riskRef = useRef(null);
  const distanceToInvalidationRef = useRef(null);
  const distanceToTpRef = useRef(null);

  return (
    <>
      <Stack spacing="4">
        <HStack justifyContent="space-between">
          <Text>Position Size Calculator</Text>
          <HStack>
            <Button
              size="sm"
              onClick={() => clipboardPrice && setEntry(clipboardPrice)}
            >
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
                setPnl((p) => ({ ...p, pnl: {} }));
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
            setLeverageFactor(
              Math.round(res.leveragedMultiplier) / res.leveragedMultiplier
            );
          }}
          bgColor="orange.400"
          color="white"
          _hover={{ bgColor: 'orange.600' }}
          disabled={
            !distanceToInvalidation || !distanceToTp || !entry || !margin
          }
        >
          Calculate Position Size
        </Button>
        {pnl.pnl.long && !pcMode && (
          <InfoBox
            pnl={pnl}
            roundOffLeverage={roundOffLeverage}
            leverageFactor={leverageFactor}
            setRoundOffLeverage={setRoundOffLeverage}
          />
        )}
      </Stack>
      {pcMode && (
        <Box borderWidth="1px" p="6" borderRadius="md">
          {pnl.pnl.long && (
            <InfoBox
              pnl={pnl}
              roundOffLeverage={roundOffLeverage}
              leverageFactor={leverageFactor}
              setRoundOffLeverage={setRoundOffLeverage}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default PositionSize;

const InfoBox = ({
  pnl,
  roundOffLeverage,
  leverageFactor,
  setRoundOffLeverage,
}: {
  pnl: { leveragedMultiplier: number; leveragedQty: number; pnl: any };
  roundOffLeverage: boolean;
  leverageFactor: number;
  setRoundOffLeverage: (bool: boolean) => void;
}) => (
  <Stack spacing="6" fontSize="sm">
    <Box borderWidth="1px" borderRadius="lg" p="6">
      <HStack justifyContent="space-between">
        <Text>
          Allowed Leverage:{' '}
          {roundOffLeverage
            ? pnl.leveragedMultiplier * leverageFactor
            : roundOff(pnl.leveragedMultiplier, 2)}
          X
        </Text>
        <Checkbox
          defaultChecked
          size="sm"
          onChange={() => setRoundOffLeverage(!roundOffLeverage)}
        >
          Round off Leverage
        </Checkbox>
      </HStack>
      <Text>
        Quantity:{' '}
        {roundOff(
          roundOffLeverage
            ? pnl.leveragedQty * leverageFactor
            : pnl.leveragedQty,
          5
        )}
      </Text>
      <Text>
        Gain:{' '}
        {roundOff(
          roundOffLeverage
            ? pnl.pnl.long.gain * leverageFactor
            : pnl.pnl.long.gain,
          2
        )}
      </Text>
      <Text>
        Loss:{' '}
        {roundOff(
          roundOffLeverage
            ? pnl.pnl.long.loss * leverageFactor
            : pnl.pnl.long.loss,
          2
        )}
      </Text>
      <Text>
        PNL:{' '}
        {roundOff(
          roundOffLeverage
            ? pnl.pnl.long.pnl * leverageFactor * 100
            : pnl.pnl.long.pnl * 100,
          2
        )}
        %
      </Text>
      <Text>R/R: {roundOff(pnl.pnl.long.rr, 2)}</Text>
    </Box>
    <Box borderWidth="1px" borderRadius="lg" p="6">
      <Text mb="4" fontWeight="bold">
        Long Position
      </Text>
      <Text>TP: {roundOff(pnl.pnl.long.TP, 5)}</Text>
      <Text>SL: {roundOff(pnl.pnl.long.SL, 5)}</Text>
      <Text>
        Liquidation Price: {roundOff(pnl.pnl.long.liquidationPrice, 5)}
      </Text>
    </Box>
    <Box borderWidth="1px" borderRadius="lg" p="6">
      <Text mb="4" fontWeight="bold">
        Short Position
      </Text>
      <Text>TP: {roundOff(pnl.pnl.long.liquidationPrice, 5)}</Text>
      <Text>SL: {roundOff(pnl.pnl.long.liquidationPrice, 5)}</Text>
      <Text>
        Liquidation Price: {roundOff(pnl.pnl.long.liquidationPrice, 5)}
      </Text>
    </Box>
  </Stack>
);

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

  const allowedLeverageAmount = risk / dti;
  const leveragedMultiplier = allowedLeverageAmount / m;
  const leveragedQty = (margin * leveragedMultiplier) / e;

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
  short.liquidationPrice = (e * leveragedQty + m) / leveragedQty;
  // short.gain = (e - short.TP) * leveragedQty;
  // short.loss = (e - short.SL) * leveragedQty;
  // short.rr = (short.gain / short.loss) * -1;
  // short.pnl = short.gain / m;

  return {
    pnl: { long, short },
    leveragedMultiplier,
    percentOfAccountCapital,
    leveragedQty,
  };
}
