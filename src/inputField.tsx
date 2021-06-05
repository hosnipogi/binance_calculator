import React from 'react';
// import { Stack } from '@chakra-ui/react';
import Range from './fields/range';
import Select from './fields/select';
import Input from './fields/input';
import { T } from './fields/types';

const InputField = ({ type, func, reference, value, placeholder }: T) => {
  return (
    <>
      {type !== 'select' ? (
        <>
          {type !== 'range' ? (
            <>
              <Input
                func={func}
                reference={reference}
                value={value as string}
                placeholder={placeholder}
              />
            </>
          ) : (
            <Range func={func} reference={reference} value={value as string} />
          )}
        </>
      ) : (
        <Select
          func={func}
          value={value as { coin: string; price: string }[]}
          reference={reference}
        />
      )}
    </>
  );
};

export default InputField;
