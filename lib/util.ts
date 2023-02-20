import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils.js";
import moment from "moment";

export function etow(inputValue: string) {
  return parseUnits(inputValue.toString());
}

export function wtoe(weis: BigNumber | undefined, maxDecimals: number = 5) {
  if (!weis) {
    return "";
  }
  const units = parseUnits("1", 18 - maxDecimals);
  return formatUnits(weis.div(units).mul(units));
}

export function wtoeCommify(
  weis: BigNumber | undefined,
  maxDecimals: number = 5
) {
  if (!weis) {
    return "";
  }
  const units = parseUnits("1", 18 - maxDecimals);
  return commify(formatUnits(weis.div(units).mul(units)));
}

/**
 * returns amount in dollar truncated to max 2 decimal places
 * @param value amount expressed in weis
 * @param etherPrice ethereum price in dollars
 */
export const weiToDollarStr = (
  value: BigNumber | undefined,
  etherPrice: number | undefined
) => {
  if (!value || !etherPrice) {
    return "";
  }
  return wtoeCommify(value.mul(etherPrice * 100).div(100));
};

/**
 * convert ETHEREUMS expressed as a js-number with MAX 4 decimals into a WEIS-string
 * @param n amount in ETHEREUM MAX 6 DECIMALS
 */
export function etowString(n: number) {
  let by1e6 = Math.round(n * 1e6).toString(); // ETHEREUM * 1e6 - round
  let weisText = by1e6 + "0".repeat(12); //  mul by 1e12 => weis = ETHEREUM * 1e(6+12)
  return weisText;
}

/**
 * returns amount truncated,default to 2 decimal places
 * @param weis amount expressed in weis
 */
export function wtoeNumber(weis: string, decimals: number = 5) {
  if (!weis) return 0;
  if (weis.indexOf(".") !== -1)
    throw new Error("a wei string can't have a decimal point: " + weis);
  let negative = false;
  if (weis.startsWith("-")) {
    negative = true;
    weis = weis.slice(1);
  }
  let padded = weis.padStart(19, "0"); //at least 0.xxx
  let ethreumText =
    padded.slice(0, -18) + "." + padded.slice(-18, decimals - 18); //add decimal point. Equivalent to ether=weis/1e18 and truncate to 4 dec places
  return Number(ethreumText) * (negative ? -1 : 1);
}

/**
 * returns ETHEREUM amount in dollars. Result is truncated, default to 2 decimal places
 * @param value amount expressed in weis
 * @param ethreumPrice ETHEREUM price in dollars
 */
export const weiToDollarStr2 = (value: string, ethreumPrice: number) => {
  const result = wtoeNumber(value) * ethreumPrice;
  return result.toLocaleString();
};

/**
 * returns ethereum amount formatted in locale string. Result is truncated, default to 5 decimal places
 * @param value amount expressed in weis
 * @param decimals decimals to truncate result value. default to 5
 */
export const formatToLocaleEthereum = (value: number, decimals: number = 5) => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

/**
 * returns string with a decimal point and 24 decimal places
 * @param {string} weisString amount in weiss
 */
export function wtoeFull(weisString: string): string {
  let result = (weisString + "").padStart(19, "0");
  result = result.slice(0, -18) + "." + result.slice(-18);
  return result;
}

/**
 * converts a string with and commas and decimal places into a number
 * @param {string} str decimal string whit commas
 */
export function toNumber(str: string): number {
  const result = Number(str.replace(/,/g, ""));
  if (isNaN(result)) return 0;
  return result;
}

/**
 * Formats a number in ETHEREUM to a string with commas and 5 decimal places
 * @param {number} n
 */
export function toStringDec(n: number, decimals: number = 5) {
  return addCommas(toStringDecSimple(n, decimals));
}

/**
 * Formats a number to a string with commas and n decimal places
 * @param {number} n
 */
export function toStringDec2(n: number, decimals: number = 2): string {
  if (isNaN(n)) return "";
  const textNoDec = Math.round(n * 10 ** decimals)
    .toString()
    .padStart(decimals + 1, "0");
  return addCommas(
    textNoDec.slice(0, -decimals) + "." + textNoDec.slice(-decimals)
  );
}

/**
 * Formats a number in ETHEREUM to a string with commas and 5 decimal places
 * @param {number} n
 */
export function toStringDecSimple(n: number, decimals: number = 5) {
  const textNoDec = Math.round(n * 10 ** decimals)
    .toString()
    .padStart(decimals + 1, "0");
  return textNoDec.slice(0, -decimals) + "." + textNoDec.slice(-decimals);
}

/**
 * Formats a number in ETHEREUM to a string with commas and 5 decimal places
 * @param {number} weis
 */
export function toStringDecPrice(weis: string): string {
  const n = Number(wtoeFull(weis));
  if (isNaN(n)) return "";
  return addCommas(toStringDecSimple(n, 10));
}

/**
 * Formats a number in ETHEREUM to a string with commas and 5,2, or 0 decimal places
 * @param {number} n
 */
export function toStringDecMin(n: number) {
  return addCommas(removeDecZeroes(toStringDecSimple(n)));
}

/**
 * removes extra zeroes after the decimal point
 * it leaves >4,2, or none (never 3 to not confuse the international user)
 * @param {string} withDecPoint
 */
export function removeDecZeroes(withDecPoint: string): string {
  let decPointPos = withDecPoint.indexOf(".");
  if (decPointPos <= 0) return withDecPoint;
  let decimals = withDecPoint.length - decPointPos - 1;
  while (withDecPoint.endsWith("0") && decimals-- > 4)
    withDecPoint = withDecPoint.slice(0, -1);
  if (withDecPoint.endsWith("00")) withDecPoint = withDecPoint.slice(0, -2);
  if (withDecPoint.endsWith(".00")) withDecPoint = withDecPoint.slice(0, -3);
  return withDecPoint;
}

/**
 * adds commas to a string number
 * @param {string} str decimal string without
 */
export function addCommas(str: string) {
  let n = str.indexOf(".");
  if (n == -1) n = str.length;
  n -= 4;
  while (n >= 0) {
    str = str.slice(0, n + 1) + "," + str.slice(n + 1);
    n = n - 3;
  }
  return str;
}

/**
 * format an address to max 14 characters
 * @param {string} accountId
 */
export function showShortAccountId(accountId: string): string {
  if (accountId.length > 14) {
    return accountId.slice(0, 6) + ".." + accountId.slice(-6);
  }
  return accountId;
}

export const formatTimestamp = (timestamp: number) => {
  return moment(timestamp).format("YYYY/MM/DD HH:MM");
};

export function unixTimestamp(): number {
  return new Date().getTime() / 1000;
}
