import { Container, Center, Heading, VStack } from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { DisconnectedPage } from "../../components/DisconnectedPage";
import { NearStats } from "./NearStats";
import { HarvestManager } from "./HarvestManager";
import { useState } from "react";

const Harvest = () => {
  const [buttonLoading, setButtonLoading] = useState<
    "" | "harvestButton" | "stNearButton" | "MetaButton"
  >("");

  const { selector } = useWalletSelector();

  if (!selector.isSignedIn()) {
    return <DisconnectedPage title="My Account" />;
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
            My Account
          </Heading>
          <NearStats buttonLoading={buttonLoading} />
          <HarvestManager
            buttonLoading={buttonLoading}
            setButtonLoading={setButtonLoading}
          />{" "}
        </VStack>
      </Center>
    </Container>
  );
};

export default Harvest;
