export const getNearDollarPrice = async () => {
  let nearDollarPrice;
  let result = await fetch("https://api.diadata.org/v1/quotation/NEAR");
  let response = await result.json();
  nearDollarPrice = response.Price;
  return nearDollarPrice;
};
