import React, { RefObject } from 'react';
import { T } from './types';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import sanitizeNumInput from '../utils/sanitizeNumInput';

function InputElement({ placeholder, func, reference, value }: T) {
  return (
    <>
      <InputGroup>
        <InputLeftElement
          w="20%"
          children={<Text fontSize=".7em">{placeholder}</Text>}
        />
        <Input
          textAlign="right"
          pr="20"
          onChange={() => {
            const val = reference.current?.value!;
            const sanitized = sanitizeNumInput(val);
            sanitized && func(sanitized);
            !val.length && func(0);
          }}
          inputMode="decimal"
          ref={reference as RefObject<HTMLInputElement>}
          value={value as number}
        />
        <InputRightElement
          children={
            <Text fontSize=".7em" mr="8">
              {placeholder === 'Quantity'
                ? '(unit/s)'
                : placeholder === 'Distance To Invalidation'
                ? '%'
                : placeholder === 'Distance To TP'
                ? '%'
                : 'USDT'}
            </Text>
          }
        />
      </InputGroup>
    </>
  );
}

export default InputElement;
