import moment from "moment";
import { providers } from "near-api-js";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import { TransactionStatusResult } from "../types/transactions.types";
import { nearConfig, provider } from "./near";

export const decodeJsonRpcData = (data: any) => {
  let res = "";
  for (let i = 0; i < data.length; i++) {
    res += String.fromCharCode(data[i]);
  }
  return JSON.parse(res);
};

export const encodeJsonRpcData = (data: any) => {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};

/**
 * convert nears expressed as a js-number with MAX 4 decimals into a yoctos-string
 * @param n amount in near MAX 6 DECIMALS
 */
export function ntoy(n: number) {
  let by1e6 = Math.round(n * 1e6).toString(); // near * 1e6 - round
  let yoctosText = by1e6 + "0".repeat(18); //  mul by 1e18 => yoctos = near * 1e(6+18)
  return yoctosText;
}

/**
 * returns amount truncated to 4 decimal places
 * @param yoctos amount expressed in yoctos
 */
export function yton(yoctos: string, decimals = 5) {
  if (!yoctos) return 0;
  if (yoctos.indexOf(".") !== -1)
    throw new Error("a yocto string can't have a decimal point: " + yoctos);
  let negative = false;
  if (yoctos.startsWith("-")) {
    negative = true;
    yoctos = yoctos.slice(1);
  }
  let padded = yoctos.padStart(25, "0"); //at least 0.xxx
  let nearsText = padded.slice(0, -24) + "." + padded.slice(-24, decimals - 24); //add decimal point. Equivalent to near=yoctos/1e24 and truncate to 4 dec places
  return Number(nearsText) * (negative ? -1 : 1);
}

/**
 * returns near amount in dollars. Result is truncated, default to 2 decimal places
 * @param value amount expressed in yoctos
 * @param nearPrice near price in dollars
 * @param decimals decimals to truncate result value. default to 2
 */
export const yoctoToDollarStr = (
  value: string,
  nearPrice: number,
  decimals: number = 3
) => {
  const result = yton(value) * nearPrice;
  return result.toLocaleString();
};

/**
 * returns near amount formatted in locale string. Result is truncated, default to 4 decimal places
 * @param value amount expressed in yoctos
 * @param decimals decimals to truncate result value. default to 2
 */
export const formatToLocaleNear = (value: number, decimals: number = 4) => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
};

export const getTxFunctionCallMethod = (
  finalExecOutcome: providers.FinalExecutionOutcome
) => {
  let method: string | undefined = undefined;
  if (finalExecOutcome.transaction?.actions?.length) {
    const actions = finalExecOutcome.transaction.actions;
    //recover methodName of first FunctionCall action
    for (let n = 0; n < actions.length; n++) {
      let item = actions[n];
      if ("FunctionCall" in item) {
        method = item.FunctionCall.method_name;
        break;
      }
    }
  }
  return method;
};

export const getLogsAndErrorsFromReceipts = (txResult: any) => {
  let result = [];
  try {
    for (let ro of txResult.receipts_outcome) {
      //get logs
      for (let logLine of ro.outcome.logs) {
        result.push(logLine);
      }
      //check status.Failure
      if (ro.outcome.status.Failure) {
        result.push(JSON.stringify(ro.outcome.status.Failure));
      }
    }
  } catch (ex) {
    result.push("internal error parsing result outcome");
  } finally {
    return result.join("\n");
  }
};

export const getPanicError = (txResult: any) => {
  try {
    for (let ro of txResult.receipts_outcome) {
      //check status.Failure
      if (ro.outcome.status.Failure) {
        return formatJSONErr(ro.outcome.status.Failure);
      }
    }
    return "";
  } catch (ex) {
    return "internal error parsing result outcome";
  }
};

export const getPanicErrorFromText = (text: string) => {
  let result = text;
  const KEY = "panicked at ";
  const kl = KEY.length;
  let n = text.indexOf(KEY);
  if (n > 0 && n < text.length - kl - 5) {
    const i = text.indexOf("'", n + kl + 4);
    const cut = text.slice(n + kl, i);
    if (cut.trim().length > 5) {
      //debug: console.error(text.slice(n, i + 80)) //show info in the console before removing extra info
      result = cut;
    }
  }
  return result;
};

export const formatJSONErr = (obj: any) => {
  let text = JSON.stringify(obj);
  text = text.replace(/{/g, " ");
  text = text.replace(/}/g, " ");
  text = text.replace(/"/g, "");

  //---------
  //try some enhancements
  //---------
  //convert yoctoNEAR to near
  const largeNumbersFound = text.match(/\d{14,50}/g);
  if (largeNumbersFound) {
    for (const matches of largeNumbersFound) {
      const parts = matches.split(" ");
      const yoctoString = parts.pop() || "";
      if (yoctoString.length >= 20) {
        // convert to NEAR
        text = text.replace(
          new RegExp(yoctoString, "g"),
          yton(yoctoString).toString()
        );
      }
    }
  }

  //if panicked-at: return relevant info only
  //debug: console.error(text); //show info in the console before removing extra info
  text = getPanicErrorFromText(text);
  return text;
};

export const getTxStatus = async (
  txHash: string,
  account_id: string
): Promise<TransactionStatusResult> => {
  // const decodedTxHash = utils.serialize.base_decode(txHash);
  const finalExecutionOutcome = await provider.txStatus(txHash, account_id);
  const txUrl = `${nearConfig.explorerUrl}/transactions/${txHash}`;
  const method = getTxFunctionCallMethod(finalExecutionOutcome);
  const panicError = getPanicError(finalExecutionOutcome);
  if (!finalExecutionOutcome) {
    return { found: false };
  }
  if (panicError) {
    return {
      success: false,
      found: true,
      errorMessage: panicError,
      method: method,
      transactionExplorerUrl: txUrl,
    };
  }
  return {
    success: true,
    found: true,
    data: getTransactionLastResult(finalExecutionOutcome),
    method: method,
    finalExecutionOutcome: finalExecutionOutcome,
    transactionExplorerUrl: txUrl,
  };
};

export const formatTimestamp = (timestamp: number) => {
  return moment(timestamp).format("YYYY/MM/DD HH:MM");
};

//----------------------------------
//------ conversions YoctoNEAR <-> Near
//----------------------------------

//BigInt scientific notation
// const base1e = BigInt(10);
// function b1e(n: number) {
//   return base1e ** BigInt(n);
// }
// const b1e12 = b1e(12);
// const b1e24 = b1e(24);
// const b1e18 = b1e(18);

// //TGas number -> U64String
// export function TGas(tgas: number): string {
//   return (BigInt(tgas) * b1e12).toString(); // tgas*1e12 // Note: gas is u64
// }

/**
 * returns string with a decimal point and 24 decimal places
 * @param {string} yoctoString amount in yoctos
 */
export function ytonFull(yoctoString: string): string {
  let result = (yoctoString + "").padStart(25, "0");
  result = result.slice(0, -24) + "." + result.slice(-24);
  return result;
}

//-------------------------------------
//--- conversions User-input <-> Number
//-------------------------------------
/**
 * converts a string with and commas and decimal places into a number
 * @param {string} str
 */
export function toNumber(str: string): number {
  const result = Number(str.replace(/,/g, ""));
  if (isNaN(result)) return 0;
  return result;
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
 * Formats a number in NEAR to a string with commas and 5 decimal places
 * @param {number} n
 */
function toStringDecSimple(n: number, decimals: number = 5) {
  const textNoDec = Math.round(n * 10 ** decimals)
    .toString()
    .padStart(decimals + 1, "0");
  return textNoDec.slice(0, -decimals) + "." + textNoDec.slice(-decimals);
}
/**
 * Formats a number in NEAR to a string with commas and 5 decimal places
 * @param {number} n
 */
export function toStringDecPrice(yoctos: string): string {
  const n = Number(ytonFull(yoctos));
  if (isNaN(n)) return "";
  return addCommas(toStringDecSimple(n, 10));
}
/**
 * Formats a number in NEAR to a string with commas and 5 decimal places
 * @param {number} n
 */
export function toStringDec(n: number, decimals: number = 5) {
  return addCommas(toStringDecSimple(n, decimals));
}
/**
 * removes extra zeroes after the decimal point
 * it leaves >4,2, or none (never 3 to not confuse the international user)
 * @param {number} n
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
 * Formats a number in NEAR to a string with commas and 5,2, or 0 decimal places
 * @param {number} n
 */
export function toStringDecMin(n: number) {
  return addCommas(removeDecZeroes(toStringDecSimple(n)));
}
/**
 * adds commas to a string number
 * @param {string} str
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

export function unixTimestamp(): number {
  return new Date().getTime() / 1000;
}

export function showShortAccountId(accountId: string): string {
  if (accountId.length > 14) {
    return accountId.slice(0, 6) + ".." + accountId.slice(-6);
  }
  return accountId;
}
