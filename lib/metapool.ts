import { Wallet } from "@near-wallet-selector/core";
import { MetapoolAccountInfo, MetapoolContractState } from "./metapool.types";
import { metaPoolMethods } from "./methods";
import { callChangeMethod, callViewMethod, CONTRACT_ID } from "./near";
import { ntoy } from "./util";
const contractId: string = CONTRACT_ID!;

export const getMetapoolAccountInfo = async (
  accountId: string
): Promise<MetapoolAccountInfo> => {
  return callViewMethod(
    metaPoolMethods.getAccountInfo,
    {
      account_id: accountId,
    },
    contractId
  );
};

export const getMetapoolContractState =
  async (): Promise<MetapoolContractState> => {
    return callViewMethod(metaPoolMethods.getContractState, {}, contractId);
  };

export const depositAndStake = (
  wallet: Wallet,
  accountId: string,
  nearsToDeposit: number
) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.DepositAndStake,
    {},
    contractId,
    ntoy(nearsToDeposit)
  );
};

export const liquidUnstake = (
  wallet: Wallet,
  accountId: string,
  stnearToBurn: number,
  minExpectedNear: number
) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.liquidUnstake,
    {
      st_near_to_burn: ntoy(stnearToBurn),
      min_expected_near: ntoy(minExpectedNear),
    },
    contractId,
    "0"
  );
};

export const unstake = (wallet: Wallet, accountId: string, amount: number) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.unstake,
    { amount: ntoy(amount) },
    contractId,
    "0"
  );
};

export const computeCurrentUnstakingDelay = (amount: number) => {
  return callViewMethod(
    metaPoolMethods.computeCurrentUnstakingDelay,
    { amount: ntoy(amount) },
    contractId
  );
};

export const withdrawUnstaked = (wallet: Wallet, accountId: string) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.withdrawUnstaked,
    {},
    contractId,
    "0"
  );
};

export const nslpAddLiquidity = (
  wallet: Wallet,
  accountId: string,
  amount: number
) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.nslpAddLiquidity,
    {},
    contractId,
    ntoy(amount)
  );
};

export const nslpRemoveLiquidity = (
  wallet: Wallet,
  accountId: string,
  amount: number
) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.nslpRemoveLiquidity,
    { amount: ntoy(amount) },
    contractId,
    "0"
  );
};

export const harvestMeta = (wallet: Wallet, accountId: string) => {
  return callChangeMethod(
    wallet,
    accountId,
    metaPoolMethods.harvestMeta,
    {},
    contractId,
    "1"
  );
};
