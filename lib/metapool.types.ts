import { BigNumber } from "ethers";

export type ContractData = {
  contractBalance: BigNumber;
  minEthDeposit: BigNumber;
  userBalance: BigNumber;
  validatorsCount: BigNumber;
  withdrawFee: number;
};
