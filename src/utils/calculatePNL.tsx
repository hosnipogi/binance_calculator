type T = {
  entry: number;
  exit: number;
  qty?: number;
  leverage: number;
  isLong?: boolean;
  exitSL?: number;
};

export default function calculateProfit({
  entry,
  exit = 0,
  qty = 1,
  leverage,
  isLong = true,
  exitSL = 0,
}: T) {
  try {
    if (exitSL && exitSL > exit && isLong)
      throw new Error('Stop loss cannot be greater than TP when long');

    if (exitSL && exitSL < exit && !isLong)
      throw new Error('Stop loss cannot be less than TP when short');

    const x = exit * qty;
    const e = entry * qty;

    const profit = exitSL ? x - e : isLong ? x - e : -1 * (x - e);
    const loss = exitSL ? exitSL * qty - e : 0;
    const amount = qty * entry;
    const margin = amount / leverage;
    const roe = {
      profit: Math.round((profit / margin) * 100),
      loss: Math.round((loss / margin) * 100),
    };

    return { profit, roe, margin, loss, err: null };
  } catch (e) {
    return {
      profit: 0,
      roe: { profit: 0, loss: 0 },
      margin: 0,
      loss: 0,
      err: e,
    };
  }
}
