import { toNumber } from "../../lib/util";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  checkMaxAccountAmount,
  checkMinTxAmount,
} from "../../utils/unstakeHandlers";

export const checkTxErrorAmounts = (
  inputAmount: string,
  accountAmount: string,
  minAmount: number,
  txName: "Stake" | "Add" | "Remove"
) => {
  try {
    const txAmount = toNumber(inputAmount.toString());
    checkMinTxAmount(txAmount, minAmount, txName);
    const balanceName = txName !== "Remove" ? "NEAR Balance" : "Shared Value";
    checkMaxAccountAmount(accountAmount, txAmount, balanceName);
  } catch (ex) {
    return getErrorMessage(ex);
  }
};
