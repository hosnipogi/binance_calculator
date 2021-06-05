import React, { RefObject } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from '@chakra-ui/react';
import { T } from './types';

function RangeElement({ func, value, reference }: T) {
  return (
    <>
      <Text>Leverage</Text>
      <Slider
        aria-label="slider-ex-1"
        defaultValue={1}
        min={1}
        max={100}
        onChange={() => {
          !isNaN(+reference.current?.value!)
            ? func(+reference.current?.value!)
            : func(0);
        }}
        ref={reference as RefObject<HTMLInputElement>}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text fontSize="sm">{value}X</Text>
    </>
  );
}

export default RangeElement;
