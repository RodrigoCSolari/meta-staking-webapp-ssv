import { Container, Center, Heading, VStack, Text } from "@chakra-ui/react";
import { UserStats } from "./UserStats";
import { LiquidityPoolStats } from "./LiquidityPoolStats";
import { DisconnectedPage } from "../../components/DisconnectedPage";
import { UnstakeForm } from "./UnstakeForm";
import { useAccount } from "wagmi";

const Unstake = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <>
        <DisconnectedPage title="Liquid Unstake">
          <LiquidityPoolStats />
        </DisconnectedPage>
      </>
    );
  }

  return (
    <Container maxW="container.lg" className="flex">
      <Center>
        <VStack mb="20px" rowGap="10px">
          <Heading
            as="h1"
            color="#0F172A"
            textAlign="center"
            fontWeight="500"
            fontSize="2em"
            my="10px"
          >
            Liquid Unstake
          </Heading>

          <UnstakeForm />

          <UserStats />
          <Text>Liquidity Pool Stats</Text>
          <LiquidityPoolStats />
        </VStack>
      </Center>
    </Container>
  );
};

export default Unstake;
