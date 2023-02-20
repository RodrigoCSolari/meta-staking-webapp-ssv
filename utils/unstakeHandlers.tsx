import { BigNumber } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils.js";
import { wtoe } from "../lib/util";

export function checkMinTxAmount(
  inputAmount: string,
  minAmount: BigNumber,
  txName: "Stake" | "Add" | "Remove"
) {
  const inputAmountBN = parseUnits(inputAmount || "0");
  if (inputAmountBN.lt(minAmount) || inputAmountBN.lte(0)) {
    throw Error(`${txName} At Least ${wtoe(minAmount)} ETHERS`);
  }
}

export function checkMinUnstakeAmount(
  unstakeInput: string,
  accountAmount: BigNumber
) {
  const MIN_UNSTAKE_ETHEREUM = parseUnits("0.001");
  const unstakeInputBN = parseUnits(unstakeInput || "0");
  if (accountAmount.lte(MIN_UNSTAKE_ETHEREUM)) {
    throw Error(`Unstake At Least ${accountAmount} ETHEREUM`);
  } else {
    if (MIN_UNSTAKE_ETHEREUM.gt(unstakeInputBN))
      throw Error(`Unstake At Least 0.001 ETHEREUM`);
  }
}

export function checkMaxAccountAmount(
  accountAmount: BigNumber,
  inputAmount: string,
  balanceName: "ETHEREUM Balance" | "metaETHEREUM Balance" | "Shared Value"
) {
  const inputAmountBN = parseUnits(inputAmount);
  if (accountAmount.lt(inputAmountBN)) {
    throw Error(`Your ${balanceName} Is Not Enough`);
  }
}

export function getMaxStakeAmount(ethereumBalance: BigNumber) {
  let maxStakeAmount = ethereumBalance.sub(parseEther("0.01")); //subtract one cent .- leave something for fee & storage
  if (maxStakeAmount.lt(0)) {
    maxStakeAmount = BigNumber.from(0);
  }
  return maxStakeAmount;
}
