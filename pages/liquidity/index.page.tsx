import {
  Container,
  Center,
  Heading,
  VStack,
  SkeletonCircle,
  Flex,
} from "@chakra-ui/react";
import { Apy } from "../../components/Apy";
import { UserStats } from "./UserStats";
import { DisconnectedPage } from "../../components/DisconnectedPage";
import { LiquidityManager } from "./LiquidityManager";
import { LiquidityPoolStats } from "./LiquidityPoolStats";
import { useAccount } from "wagmi";

const Liquidity = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <>
        <Flex justifyContent="center" mb="10px">
          <SkeletonCircle boxSize="120px" isLoaded>
            <Apy data="9.99" />
          </SkeletonCircle>
        </Flex>
        <DisconnectedPage title="ETHEREUM / metaETHEREUM Pool">
          <LiquidityPoolStats />
        </DisconnectedPage>
      </>
    );
  }

  return (
    <Container maxW="container.lg" className="flex">
      <Center>
        <VStack mb="20px" rowGap="10px">
          <SkeletonCircle boxSize="120px" isLoaded>
            <Apy data="9.99" />
          </SkeletonCircle>
          <Heading
            as="h1"
            color="#0F172A"
            textAlign="center"
            fontWeight="500"
            fontSize="2em"
          >
            ETHEREUM / metaETHEREUM Pool
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
