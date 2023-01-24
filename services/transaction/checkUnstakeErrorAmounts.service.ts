import { toNumber } from "../../lib/util";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  checkMaxAccountAmount,
  checkMaxLpAmount,
  checkMinUnstakeAmount,
} from "../../utils/unstakeHandlers";

export const checkUnstakeErrorAmounts = (
  inputAmount: string,
  accountAmount: string,
  lpLiquidity?: string
) => {
  try {
    const amountToUnstake = toNumber(inputAmount.toString());
    const token = lpLiquidity ? "stNEAR" : "NEAR";
    checkMinUnstakeAmount(amountToUnstake, accountAmount, token);
    checkMaxAccountAmount(accountAmount, amountToUnstake, "stNEAR Balance");
    if (lpLiquidity) {
      checkMaxLpAmount(lpLiquidity, amountToUnstake);
    }
  } catch (ex) {
    return getErrorMessage(ex);
  }
};
