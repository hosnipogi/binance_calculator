export default function addComma(num: number) {
  return num > 999 ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : num;
}
