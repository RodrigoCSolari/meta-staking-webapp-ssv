import React from "react";
import { Divider, Skeleton } from "@chakra-ui/react";
import { InfoContainer } from "../../components/InfoContainer";
import TokenInfo from "../../components/TokenInfo";
import { useGetContractData } from "../../hooks/useGetContractData";
import { useGetEthereumDollarPrice } from "../../hooks/useGetEthereumDollarPrice";
import { toStringDec2, wtoeCommify, weiToDollarStr } from "../../lib/util";

export const LiquidityPoolStats = () => {
  const { data: contractData } = useGetContractData();
  const { data: ethereumDollarPrice } = useGetEthereumDollarPrice();

  return (
    <InfoContainer>
      <Skeleton isLoaded={contractData !== undefined}>
        <TokenInfo
          description="Unstake Fee"
          tooltip=""
          amount={"0"}
          symbol="%"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractData !== undefined}>
        <TokenInfo
          description="Total Value"
          tooltip="Total ETHEREUM value in the contract"
          amount={wtoeCommify(contractData?.contractBalance)}
          symbol="Ⓔ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={ethereumDollarPrice !== undefined}>
        <TokenInfo
          description="ETHEREUM price USD"
          amount={toStringDec2(ethereumDollarPrice!)}
          symbol="$"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={
          contractData !== undefined && ethereumDollarPrice !== undefined
        }
      >
        <TokenInfo
          description="Total Value USD"
          tooltip="Total value of the contract in USD"
          amount={weiToDollarStr(
            contractData?.contractBalance,
            ethereumDollarPrice
          )}
          symbol="$"
        />
      </Skeleton>
    </InfoContainer>
  );
};
