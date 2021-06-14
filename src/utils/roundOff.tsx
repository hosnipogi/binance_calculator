export default function RoundOff(num: number, tenToThePowerOf: number) {
  const a = 10 ** tenToThePowerOf;
  return Math.round(num * a) / a;
}
