import { Divider, Skeleton } from "@chakra-ui/react";
import React from "react";
import { InfoContainer } from "../../components/InfoContainer";
import TokenInfo from "../../components/TokenInfo";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { useGetMetrics } from "../../hooks/useGetMetrics";
import { useGetNearDollarPrice } from "../../hooks/useGetNearDollarPrice";
import { toStringDec, toStringDec2, yton } from "../../lib/util";

export const MetapoolStats = () => {
  const { data: metrics } = useGetMetrics();
  const { data: contractState } = useGetMetapoolContractState();
  const { data: nearDollarPrice } = useGetNearDollarPrice();

  return (
    <InfoContainer>
      <Skeleton isLoaded={metrics !== undefined}>
        <TokenInfo
          description="Pools Staked"
          tooltip="How many validators Metapool is staking into. With more validators your
        stake gets diversified, and NEAR becomes more censorship resistant"
          amount={
            metrics?.staked_pools_count + "/" + metrics?.staking_pools_count
          }
          symbol=""
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Historic Rewards"
          tooltip="Total NEAR rewards collected since the Metapool protocol started. All
        the rewards are reflected in the ever increasing price of stNEAR"
          amount={toStringDec(yton(contractState?.accumulated_staked_rewards!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Total stNEAR Tokens"
          tooltip="Current total stNEAR tokens supply"
          amount={toStringDec(yton(contractState?.total_stake_shares!))}
          symbol="Ⓢ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="stNEAR/NEAR Liquidity"
          tooltip="Current amount of NEAR in the liquidity pool to allow users to make a
        liquid unstake"
          amount={toStringDec(yton(contractState?.nslp_liquidity!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Liquid Unstaking Fee"
          tooltip="Current liquid-unstaking fee. It varies according to the available
        liquidity supporting the liquid-unstake operations.
        You can avoid the liquid-unstake fees by selecting delayed-unstake and wait for 2-6 days until your
        NEAR is unstaked"
          amount={(
            contractState?.nslp_current_discount_basis_points! / 100
          ).toString()}
          symbol="%"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="Total Value"
          tooltip="Total NEAR value in the contract, considering the liquidity pool and the
        stNEAR tokens"
          amount={toStringDec(
            yton(contractState?.nslp_liquidity!) +
              yton(contractState?.total_for_staking!)
          )}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={nearDollarPrice !== undefined}>
        <TokenInfo
          description="Near price USD"
          amount={toStringDec2(nearDollarPrice)}
          symbol="$"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={contractState !== undefined && nearDollarPrice !== undefined}
      >
        <TokenInfo
          description="Total Value USD"
          tooltip="Total value of the contract in USD"
          amount={toStringDec2(
            (yton(contractState?.nslp_liquidity!) +
              yton(contractState?.total_for_staking!)) *
              nearDollarPrice
          )}
          symbol="$"
        />
      </Skeleton>
    </InfoContainer>
  );
};
