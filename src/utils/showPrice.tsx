export default function showPrice(
  coinsList: { coin: string; price: string }[],
  val: string
) {
  const found = coinsList.find((el) => el.coin === val);
  return found;
}
