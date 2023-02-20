import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Center,
  Heading,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { Apy } from "../../components/Apy";
import { UserStats } from "./UserStats";
import { MetapoolStats } from "./MetapoolStats";
import { InfoContainer } from "../../components/InfoContainer";
import { StakeForm } from "./StakeForm";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Stake = () => {
  const { isConnected, address } = useAccount();
  const [DisconnectInput, setDisconnectInput] = useState("");
  const { openConnectModal } = useConnectModal();

  const handleSignIn = () => {
    if (DisconnectInput) {
      localStorage.setItem("disconnectInput", DisconnectInput);
    }
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  const handleDisconnectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisconnectInput(e.target.value);
  };

  useEffect(() => {
    if (!address) {
      localStorage.setItem("disconnectInput", "");
    }
  }, []);

  return (
    <>
      <Container maxW="container.lg" className="flex">
        <Center>
          <VStack mb="20px" rowGap="10px">
            <SkeletonCircle boxSize="120px" isLoaded={true}>
              <Apy data="9.99" />
            </SkeletonCircle>
            <Heading
              as="h1"
              color="#0F172A"
              textAlign="center"
              fontSize="2em"
              fontWeight="500"
            >
              Stake ETHEREUM
            </Heading>

            {!isConnected ? (
              <InfoContainer>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="black"
                    fontSize="1.5em"
                    fontWeight="500"
                  >
                    Ⓔ
                  </InputLeftElement>
                  <Input
                    placeholder="Ethereum amount"
                    type="number"
                    id="stakeInput"
                    onKeyDown={handleKeyDown}
                    value={DisconnectInput}
                    onChange={handleDisconnectInput}
                  />
                </InputGroup>
                <Button colorScheme="purple" onClick={handleSignIn}>
                  Choose A Wallet To Stake
                </Button>
              </InfoContainer>
            ) : (
              <>
                <StakeForm />
                <UserStats />
              </>
            )}
            <Text>MetaPool Stats</Text>
            <MetapoolStats />
          </VStack>
        </Center>
      </Container>
    </>
  );
};

export default Stake;
