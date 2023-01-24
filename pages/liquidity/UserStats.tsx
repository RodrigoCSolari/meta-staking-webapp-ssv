import { Divider, Flex, Skeleton } from "@chakra-ui/react";
import React from "react";
import { InfoContainer } from "../../components/InfoContainer";
import TokenInfo from "../../components/TokenInfo";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { useGetNearBalance } from "../../hooks/useGetNearBalance";
import { toStringDec, yton } from "../../lib/util";

export const UserStats = () => {
  const { accountId } = useWalletSelector();

  const { data: nearBalance } = useGetNearBalance(accountId!);
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);

  return (
    <InfoContainer>
      <Skeleton isLoaded={nearBalance !== undefined}>
        <TokenInfo
          description="Available NEAR wallet"
          tooltip="The amount of NEAR in your wallet"
          amount={toStringDec(yton(nearBalance!), 2)}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={accountInfo !== undefined}>
        <TokenInfo
          description="Your stNEAR Tokens"
          tooltip="The amount of stNEAR tokens you have available in your wallet"
          amount={toStringDec(yton(accountInfo?.st_near!))}
          symbol="Ⓢ"
        />
      </Skeleton>
    </InfoContainer>
  );
};
