import { Container, Center, Heading, VStack } from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { UserStats } from "./UserStats";
import { DelayedUnstakeStats } from "./DelayedUnstakeStats";
import { DisconnectedPage } from "../../components/DisconnectedPage";
import { DelayedUnstakeForm } from "./DelayedUnstakeForm";
import { useState } from "react";

const DelayedUnstake = () => {
  const [buttonLoading, setButtonLoading] = useState<
    "" | "unstakeButton" | "withdrawButton"
  >("");

  const { selector } = useWalletSelector();

  if (!selector.isSignedIn()) {
    return <DisconnectedPage title="Delayed Unstake" />;
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
            Delayed Unstake
          </Heading>

          <DelayedUnstakeForm
            buttonLoading={buttonLoading}
            setButtonLoading={setButtonLoading}
          />
          <UserStats />
          <DelayedUnstakeStats
            buttonLoading={buttonLoading}
            setButtonLoading={setButtonLoading}
          />
        </VStack>
      </Center>
    </Container>
  );
};

export default DelayedUnstake;
