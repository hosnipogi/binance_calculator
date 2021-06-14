import { Box, useRadio } from '@chakra-ui/react';

export default function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        _checked={{
          bg: 'orange.400',
          color: 'white',
          borderColor: 'orange.400',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        _hover={{
          bgColor: 'orange.600',
        }}
        p={2}
        fontSize="xs"
      >
        {props.children}
      </Box>
    </Box>
  );
}
