import { Divider, Flex, Skeleton } from "@chakra-ui/react";
import React from "react";
import { InfoContainer } from "../../components/InfoContainer";
import TokenInfo from "../../components/TokenInfo";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { toStringDec, yton } from "../../lib/util";

export const LiquidityPoolStats = () => {
  const { data: contractState } = useGetMetapoolContractState();

  return (
    <InfoContainer>
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Target Liquidity"
          tooltip="If liquidity is below target, the unstake fee and the LP benefits are higher"
          amount={toStringDec(yton(contractState?.nslp_target!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Current Liquidity"
          tooltip="The amount of NEAR in the liquidity pool"
          amount={toStringDec(yton(contractState?.nslp_liquidity!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Current Liquid Unstake"
          tooltip="The fee on every liquid unstake operation, providing earnings for liquidity providers"
          amount={(
            contractState?.nslp_current_discount_basis_points! / 100
          ).toString()}
          symbol="%"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="stNEAR In The Pool"
          tooltip="The amount of stNEAR in the liquidity pool. Increases LP benefits"
          amount={toStringDec(yton(contractState?.nslp_stnear_balance!))}
          symbol="Ⓢ"
        />
      </Skeleton>
    </InfoContainer>
  );
};
