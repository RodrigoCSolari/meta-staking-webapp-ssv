import { Text } from "@chakra-ui/react";
import { FinalExecutionOutcome } from "@near-wallet-selector/core";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import { ONE_NEAR } from "../constants";
import {
  LiquidUnstakeResult,
  MetapoolContractState,
} from "../lib/metapool.types";
import { ntoy, toStringDec, toStringDecMin, yton, ytonFull } from "../lib/util";
import { TxSuccess } from "../stores/txSuccessStore";

export function getUnstakeResultAsString(
  amountToUnstake: number,
  contractState: MetapoolContractState
) {
  const unstakeResult = getUnstakeResult(amountToUnstake, contractState);
  let extraMsg = "";
  if (yton(unstakeResult.receive.toString()) > 0) {
    extraMsg = ` - You receive ≈ ${toStringDec(
      yton(unstakeResult.receive.toString())
    )} \u24c3`;
  }
  if (unstakeResult.liquidity < unstakeResult.receive)
    extraMsg = " - Not enough liquidity";
  return (unstakeResult.fee_bp / 100).toString() + "%" + extraMsg;
}

export function getUnstakeResult(
  amountToUnstake: number,
  contractState: MetapoolContractState
): { fee_bp: number; receive: BigInt; liquidity: bigint } {
  if (isNaN(amountToUnstake) || amountToUnstake <= 0) {
    const fee_bp = contractState.nslp_current_discount_basis_points;
    return { fee_bp: fee_bp, receive: BigInt(0), liquidity: BigInt(0) };
  } else {
    const liquidity = BigInt(contractState.nslp_liquidity);
    const receiveNear = BigInt(
      ntoy(amountToUnstake * stNearPrice(contractState.st_near_price))
    );
    const fee_bp = get_discount_basis_points(
      liquidity,
      receiveNear,
      contractState
    );
    const realReceive: BigInt =
      receiveNear - (receiveNear * BigInt(fee_bp)) / BigInt(10000);
    let extraMsg = ` - You receive ≈ ${toStringDec(
      yton(realReceive.toString())
    )} \u24c3`;
    if (liquidity < realReceive) extraMsg = " - Not enough liquidity";

    return { fee_bp: fee_bp, receive: realReceive, liquidity: liquidity };
  }
}

export function stNearPrice(st_near_price: string): number {
  return Number(ytonFull(st_near_price));
}

export function get_discount_basis_points(
  liquidity: bigint,
  sell: bigint,
  contractState: MetapoolContractState
): number {
  try {
    if (sell > liquidity) {
      //more asked than available => max discount
      return contractState.nslp_max_discount_basis_points;
    }

    const target = BigInt(contractState.nslp_target);
    const liq_after = liquidity - sell;
    if (liq_after >= target) {
      //still >= target after swap => min discount
      return contractState.nslp_min_discount_basis_points;
    }

    let range = BigInt(
      contractState.nslp_max_discount_basis_points -
        contractState.nslp_min_discount_basis_points
    );
    //here 0<after<target, so 0<proportion<range
    const proportion: bigint = (range * liq_after) / target;
    return contractState.nslp_max_discount_basis_points - Number(proportion);
  } catch (ex) {
    console.error(ex);
    return contractState.nslp_current_discount_basis_points;
  }
}

export function checkMinTxAmount(
  txAmount: number,
  minAmount: number,
  txName: "Stake" | "Add" | "Remove"
) {
  if (minAmount === 0 && txAmount <= 0) {
    throw Error(`Amount Should Be Greater Than Zero`);
  } else if (txAmount < minAmount) {
    throw Error(`${txName} At Least ${minAmount} NEAR`);
  }
}

export function checkMinUnstakeAmount(
  amountToUnstake: number,
  accountAmount: string,
  token: "stNEAR" | "NEAR"
) {
  const MIN_UNSTAKE_NEAR = 1;
  let accountStnear = yton(accountAmount);
  if (accountStnear <= MIN_UNSTAKE_NEAR) {
    if (amountToUnstake + 0.0000001 < accountStnear)
      throw Error(`Unstake At Least ${accountStnear} ${token}`);
  } else {
    if (amountToUnstake < MIN_UNSTAKE_NEAR)
      throw Error(`Unstake At Least ${MIN_UNSTAKE_NEAR} ${token}`);
  }
}

export function checkMaxLpAmount(liquidity: string, amount: number) {
  const liquidityBigInt = BigInt(liquidity);
  const amountBigInt = BigInt(ntoy(amount));
  if (amountBigInt > liquidityBigInt)
    throw Error(
      `There's Not Enough Liquidity. Max Is ${toStringDecMin(
        yton(liquidity)
      )} NEAR. You Can Use Delayed-Unstake For Large Amounts`
    );
}

export function checkMaxAccountAmount(
  accountAmount: string,
  amount: number,
  balanceName: "NEAR Balance" | "stNEAR Balance" | "Shared Value"
) {
  const accountAmountBigInt = BigInt(accountAmount);
  const amountBigInt = BigInt(ntoy(amount));
  if (amountBigInt > accountAmountBigInt) {
    throw Error(`Your ${balanceName} Is Not Enough`);
  }
}

export function getMaxStakeAmount(nearBalance: string) {
  let maxStakeAmount = BigInt(nearBalance) - BigInt(ONE_NEAR) / BigInt(100); //subtract one cent .- leave something for fee & storage
  if (maxStakeAmount < 0) {
    maxStakeAmount = BigInt(0);
  }
  return maxStakeAmount.toString();
}

export async function showUnstakeResult(
  result: LiquidUnstakeResult | FinalExecutionOutcome | undefined
): Promise<TxSuccess> {
  const response: TxSuccess = {
    title: "Tokens Unstaked Successfully",
  };
  if (!result) {
    return response;
  }

  if ("receipts_outcome" in result) {
    const resultFinalExecOutcome = result as FinalExecutionOutcome;
    result = getTransactionLastResult(resultFinalExecOutcome);
  }

  result = result as LiquidUnstakeResult;
  if (result) {
    response.description = (
      <>
        <Text textAlign="center">{`NEAR Received: ${toStringDec(
          yton(result.near)
        )}`}</Text>
        <Text textAlign="center">{`Fee: ${toStringDec(
          yton(result.fee)
        )}`}</Text>
      </>
    );
  }
  return response;
}
