import axios from 'axios';

const BINANCE_FUTURES = 'https://fapi.binance.com/fapi/v1/ticker/price';
const getPrice = async () => {
  try {
    const { data } = await axios.get(BINANCE_FUTURES);

    const market = data.map(
      ({ symbol, price }: { symbol: string; price: number }) => ({
        coin: symbol,
        price,
      })
    );
    return market;
  } catch (e) {
    throw e.message;
  }
};

export default getPrice;
