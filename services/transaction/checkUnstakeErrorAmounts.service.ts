import { BigNumber } from "ethers";
import { toNumber } from "../../lib/util";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  checkMaxAccountAmount,
  checkMinUnstakeAmount,
} from "../../utils/unstakeHandlers";

export const checkUnstakeErrorAmounts = (
  inputAmount: string,
  accountAmount: BigNumber
) => {
  try {
    checkMinUnstakeAmount(inputAmount, accountAmount);
    checkMaxAccountAmount(accountAmount, inputAmount, "ETHEREUM Balance");
  } catch (ex) {
    return getErrorMessage(ex);
  }
};
