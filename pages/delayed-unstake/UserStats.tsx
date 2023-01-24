import { Divider, Skeleton } from "@chakra-ui/react";
import React from "react";
import TokenInfo from "../../components/TokenInfo";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { useGetNearBalance } from "../../hooks/useGetNearBalance";
import { useGetNearDollarPrice } from "../../hooks/useGetNearDollarPrice";
import {
  toStringDec,
  toStringDec2,
  toStringDecPrice,
  yton,
} from "../../lib/util";
import { InfoContainer } from "../../components/InfoContainer";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";

export const UserStats = () => {
  const { accountId } = useWalletSelector();

  const { data: nearBalance } = useGetNearBalance(accountId!);
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);
  const { data: contractState } = useGetMetapoolContractState();
  const { data: nearDollarPrice } = useGetNearDollarPrice();

  return (
    <InfoContainer>
      <Skeleton isLoaded={accountInfo !== undefined}>
        <TokenInfo
          description="Your stNEAR Tokens"
          tooltip="The amount of stNEAR tokens you have available in your wallet"
          amount={toStringDec(yton(accountInfo?.st_near!))}
          symbol="Ⓢ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={contractState !== undefined}>
        <TokenInfo
          description="stNEAR Price"
          tooltip="How much NEAR one stNEAR is worth. stNEAR price increases every 12 hours"
          amount={toStringDecPrice(contractState?.st_near_price!)}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={accountInfo !== undefined}>
        <TokenInfo
          description="Your stNEAR in NEARS"
          tooltip="The amount of NEAR your stNEAR are worth"
          amount={toStringDec(yton(accountInfo?.valued_st_near!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={accountInfo !== undefined && nearDollarPrice !== undefined}
      >
        <TokenInfo
          description="Your stNEAR in USD"
          tooltip="The amount of USD your stNEAR are worth"
          amount={toStringDec2(
            yton(accountInfo?.valued_st_near!) * nearDollarPrice
          )}
          symbol="$"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={nearBalance !== undefined}>
        <TokenInfo
          description="Available NEAR wallet"
          tooltip="The amount of NEAR in your wallet"
          amount={toStringDec(yton(nearBalance!), 2)}
          symbol="Ⓝ"
        />
      </Skeleton>
    </InfoContainer>
  );
};
