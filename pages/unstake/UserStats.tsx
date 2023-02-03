import { Divider, Skeleton } from "@chakra-ui/react";
import React from "react";
import TokenInfo from "../../components/TokenInfo";
import { wtoeCommify, weiToDollarStr } from "../../lib/util";
import { InfoContainer } from "../../components/InfoContainer";
import { useGetContractData } from "../../hooks/useGetContractData";
import { useGetEthereumDollarPrice } from "../../hooks/useGetEthereumDollarPrice";
import { useGetEthereumBalance } from "../../hooks/useGetEthereumBalance";

export const UserStats = () => {
  const { data: contractData } = useGetContractData();
  const { data: ethereumDollarPrice } = useGetEthereumDollarPrice();
  const { data: ethereumBalance } = useGetEthereumBalance();

  return (
    <InfoContainer>
      <Skeleton isLoaded={ethereumBalance !== undefined}>
        <TokenInfo
          description="Available ETHEREUM wallet"
          tooltip="The amount of ETHEREUM in your wallet"
          amount={wtoeCommify(ethereumBalance)}
          symbol="Ⓔ"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={
          ethereumBalance !== undefined && ethereumDollarPrice !== undefined
        }
      >
        <TokenInfo
          description="wallet ETHEREUM in USD"
          tooltip=""
          amount={weiToDollarStr(ethereumBalance, ethereumDollarPrice)}
          symbol="$"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractData !== undefined}>
        <TokenInfo
          description="Your ETHEREUM Staked"
          tooltip="your amount of ethereum in the contract"
          amount={wtoeCommify(contractData?.userBalance)}
          symbol="Ⓔ"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={
          contractData !== undefined && ethereumDollarPrice !== undefined
        }
      >
        <TokenInfo
          description="Your ETHEREUM Staked in USD"
          tooltip=""
          amount={weiToDollarStr(
            contractData?.userBalance,
            ethereumDollarPrice
          )}
          symbol="$"
        />
      </Skeleton>
    </InfoContainer>
  );
};
