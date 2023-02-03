import { ethers } from "ethers";
import { contractMethods } from "./methods";
import { callChangeMethod, callViewMethod } from "./ethereum";
import { etow } from "./util";

export const stake = (signer: ethers.Signer, depositValue: string) => {
  return callChangeMethod(
    contractMethods.deposit,
    [],
    signer!,
    etow(depositValue)
  );
};

export const withdraw = (signer: ethers.Signer, withdrawValue: string) => {
  return callChangeMethod(
    contractMethods.withdraw,
    [etow(withdrawValue)],
    signer!,
    etow("0")
  );
};

export const getContractData = async (
  provider: ethers.providers.Provider,
  address = "0x0000000000000000000000000000000000000000"
) => {
  let [
    contractBalance,
    minEthDeposit,
    userBalance,
    validatorsCount,
    withdrawFee,
  ] = await Promise.all([
    callViewMethod(contractMethods.getContractBalance, [], provider),
    callViewMethod(contractMethods.minEthDeposit, [], provider),
    callViewMethod(contractMethods.balance, [address], provider),
    callViewMethod(contractMethods.getValidatorsCount, [], provider),
    callViewMethod(contractMethods.withdrawFee, [], provider),
  ]);
  return {
    contractBalance,
    minEthDeposit,
    userBalance,
    validatorsCount,
    withdrawFee,
  };
};
