import {
  Container,
  Center,
  Heading,
  VStack,
  SkeletonCircle,
  Flex,
} from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetMetrics } from "../../hooks/useGetMetrics";
import { Apy } from "../../components/Apy";
import { UserStats } from "./UserStats";
import { toStringDec2 } from "../../lib/util";
import { DisconnectedPage } from "../../components/DisconnectedPage";
import { LiquidityManager } from "./LiquidityManager";
import { LiquidityPoolStats } from "./LiquidityPoolStats";

const Liquidity = () => {
  const { selector } = useWalletSelector();

  const { data: metrics } = useGetMetrics();

  if (!selector.isSignedIn()) {
    return (
      <>
        <Flex justifyContent="center" mb="10px">
          <SkeletonCircle boxSize="120px" isLoaded={metrics !== undefined}>
            {metrics && (
              <Apy data={toStringDec2(metrics.lp_3_day_apy)} boxSize="120px" />
            )}
          </SkeletonCircle>
        </Flex>
        <DisconnectedPage title="NEAR / stNEAR Pool">
          <LiquidityPoolStats />
        </DisconnectedPage>
      </>
    );
  }

  return (
    <Container maxW="container.lg" className="flex">
      <Center>
        <VStack mb="20px" rowGap="10px">
          <SkeletonCircle boxSize="120px" isLoaded={metrics !== undefined}>
            {metrics && (
              <Apy data={toStringDec2(metrics.lp_3_day_apy)} boxSize="120px" />
            )}
          </SkeletonCircle>
          <Heading
            as="h1"
            color="#0F172A"
            textAlign="center"
            fontWeight="500"
            fontSize="2em"
          >
            NEAR / stNEAR Pool
          </Heading>
          <LiquidityPoolStats />
          <LiquidityManager />
          <UserStats />
        </VStack>
      </Center>
    </Container>
  );
};

export default Liquidity;
