import React, { useState } from "react";
import { Button, Flex, Text, Skeleton, Divider } from "@chakra-ui/react";
import { wtoe } from "../../lib/util";
import { AddLiquidityModal } from "./AddLiquidityModal";
import { RemoveLiquidityModal } from "./RemoveLiquidityModal";
import { InfoContainer } from "../../components/InfoContainer";
import { useGetContractData } from "../../hooks/useGetContractData";
import { formatUnits } from "ethers/lib/utils.js";

export const LiquidityManager = () => {
  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false);
  const [showRemoveLiquidityModal, setShowRemoveLiquidityModal] =
    useState(false);

  const { data: contractData } = useGetContractData();

  return (
    <>
      <InfoContainer>
        <Skeleton isLoaded={contractData !== undefined}>
          <Flex justifyContent="center">
            <Flex alignItems="center" columnGap="2px">
              <Text fontSize="1.1em">
                {`Your Share Value: ${wtoe(contractData?.userBalance)}`}
              </Text>
              <Text w="1.5em" textAlign="center">
                Ⓔ
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
        <Skeleton isLoaded={contractData !== undefined}>
          <Flex justifyContent="center">
            <Flex alignItems="center" columnGap="2px">
              {contractData && (
                <Text>
                  {`Your Share Of The Liquidity Pool: ${formatUnits(
                    contractData
                      ?.userBalance!.mul(10000)
                      .div(contractData?.contractBalance!)!,
                    2
                  )} %`}
                </Text>
              )}
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
