export default function sanitizeNumInput(input: string) {
  const regExp = /^\d+\.?[0-9]*$/;
  const num = input.match(regExp);

  if (num) {
    const validated =
      input.substring(0, 1) === '0' &&
      input.substring(1, 2) !== '' &&
      input.substring(1, 2) !== '.'
        ? input.substring(1)
        : input;
    return validated;
  }
}
