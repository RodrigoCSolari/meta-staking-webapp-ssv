import React, { useState } from "react";
import { Button, Flex, Text, Skeleton, Divider } from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { toStringDec, toStringDecMin, yton } from "../../lib/util";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { AddLiquidityModal } from "./AddLiquidityModal";
import { RemoveLiquidityModal } from "./RemoveLiquidityModal";
import { InfoContainer } from "../../components/InfoContainer";

export const LiquidityManager = () => {
  const { accountId } = useWalletSelector();

  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false);
  const [showRemoveLiquidityModal, setShowRemoveLiquidityModal] =
    useState(false);

  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);
  return (
    <>
      <InfoContainer>
        <Skeleton isLoaded={accountInfo !== undefined}>
          <Flex justifyContent="center">
            <Flex alignItems="center" columnGap="2px">
              <Text fontSize="1.1em">
                {`Your Share Value: ${toStringDec(
                  yton(accountInfo?.nslp_share_value!)
                )}`}
              </Text>
              <Text w="1.5em" textAlign="center">
                Ⓝ
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
        <Flex justifyContent="center" flexDirection="column" rowGap="10px">
          <Button
            colorScheme="purple"
            onClick={() => setShowAddLiquidityModal(true)}
          >
            Add Liquidity
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => setShowRemoveLiquidityModal(true)}
          >
            Remove Liquidity
          </Button>
        </Flex>
        <Divider />
        <Skeleton isLoaded={accountInfo !== undefined}>
          <Flex justifyContent="center">
            <Flex alignItems="center" columnGap="2px">
              <Text>
                {`Your Share Of The Liquidity Pool: ${toStringDecMin(
                  accountInfo?.nslp_share_bp! / 100
                )} %`}
              </Text>
            </Flex>
          </Flex>
        </Skeleton>
      </InfoContainer>
      <AddLiquidityModal
        setShowAddLiquidityModal={setShowAddLiquidityModal}
        showAddLiquidityModal={showAddLiquidityModal}
      />
      <RemoveLiquidityModal
        setShowRemoveLiquidityModal={setShowRemoveLiquidityModal}
        showRemoveLiquidityModal={showRemoveLiquidityModal}
      />
    </>
  );
};
