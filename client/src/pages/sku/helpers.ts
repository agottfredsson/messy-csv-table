import _ from "lodash";

import { Product } from "../../types";

export const formatArray = (productsArr: Product[]) => {
  const markets = groupByMarket(productsArr);
  const prices = markets.flatMap((market) => calculatePrices(market));
  return prices;
};

const appendCorrectIntervals = (products: Product[]) => {
  if (products.length == 1) return products;

  const finish: Product[] = [];
  products.forEach((product, i) => {
    if (i == 0) return;
    finish.push({
      ...products[i - 1],
      ValidUntil: product.ValidFrom,
    });
    if (i == products.length - 1) finish.push(product);
  });

  return finish;
};

const calculatePrices = (productsArr: Product[]) => {
  const products = productsArr.sort(
    (a, b) =>
      a.ValidFrom.localeCompare(b.ValidFrom) || a.UnitPrice - b.UnitPrice
  );

  const prices: Product[] = [];

  products.map((product, i) => {
    if (i == 0) prices.push(product);
    if (product.UnitPrice < prices[prices.length - 1].UnitPrice) {
      prices.push(product);
    }

    if (!hasOverlaps(product, products)) {
      const price = getNextPrice(product, products);

      if (
        price &&
        prices[prices.length - 1].PriceValueId != price.PriceValueId
      ) {
        prices.push({
          ...price,
          ValidFrom: prices[prices.length - 1].ValidUntil ?? "NULL",
        });
      }
    }
  });

  const res = appendCorrectIntervals(prices);
  return res;
};

const getNextPrice = (
  currentValue: Product,
  products: Product[]
): Product | undefined => {
  return products
    .filter(
      (e) =>
        e.ValidFrom < (currentValue.ValidUntil ?? "NULL") &&
        (e.ValidUntil ?? "NULL") > (currentValue.ValidUntil ?? "NULL")
    )
    .sort((a, b) => a.UnitPrice - b.UnitPrice)
    .at(0);
};
const groupByMarket = (arr: Product[]) => {
  const markets = _.groupBy(arr, (e) => e.MarketId);
  return _.map(markets, (val) => val);
};

const hasOverlaps = (product: Product, products: Product[]): boolean => {
  return !!products.filter(
    (e) =>
      e.ValidFrom >= product.ValidFrom &&
      (e.ValidUntil ?? "NULL") <= (product.ValidUntil ?? "NULL") &&
      e.PriceValueId != product.PriceValueId
  ).length;
};
