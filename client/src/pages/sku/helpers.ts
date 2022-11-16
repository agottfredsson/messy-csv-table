import _ from "lodash";

import { Product } from "../../types";

export const formatArray = (products: Product[]) => {
  const markets = groupByMarket(products);
  const prices = markets.flatMap((market) => calculatePrices(market));
  return prices;
};

//calculate the prices for each set of products per market
const calculatePrices = (arr: Product[]) => {
  const prices: Product[] = [];

  const products = arr.sort(
    (a, b) =>
      a.ValidFrom.localeCompare(b.ValidFrom) || a.UnitPrice - b.UnitPrice
  );

  products.forEach((product, i) => {
    if (i == 0) prices.push(product);
    if (product.UnitPrice < prices[prices.length - 1].UnitPrice) {
      prices.push(product);
    }

    if (!hasOverlaps(product, products)) {
      const price = getNextAvailablePrice(product, products);

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

//append the correct intervals for the product
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

//get the next available price
const getNextAvailablePrice = (
  currentProduct: Product,
  products: Product[]
): Product | undefined => {
  return products
    .filter(
      (e) =>
        e.ValidFrom < (currentProduct.ValidUntil ?? "NULL") &&
        (e.ValidUntil ?? "NULL") > (currentProduct.ValidUntil ?? "NULL")
    )
    .sort((a, b) => a.UnitPrice - b.UnitPrice)
    .at(0);
};

//group products by market
const groupByMarket = (products: Product[]) => {
  const markets = _.groupBy(products, (product) => product.MarketId);
  return _.map(markets, (value) => value);
};

//check whether price has overlapping products
const hasOverlaps = (product: Product, products: Product[]): boolean => {
  return !!products.filter(
    (e) =>
      e.ValidFrom >= product.ValidFrom &&
      (e.ValidUntil ?? "NULL") <= (product.ValidUntil ?? "NULL") &&
      e.PriceValueId != product.PriceValueId
  ).length;
};
