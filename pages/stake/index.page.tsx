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
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetMetrics } from "../../hooks/useGetMetrics";
import { Apy } from "../../components/Apy";
import { UserStats } from "./UserStats";
import { MetapoolStats } from "./MetapoolStats";
import { toStringDec2 } from "../../lib/util";
import { InfoContainer } from "../../components/InfoContainer";
import { StakeForm } from "./StakeForm";
import { disconnect } from "process";

const Stake = () => {
  const [DisconnectInput, setDisconnectInput] = useState("");
  const { modal, selector, accountId } = useWalletSelector();

  const { data: metrics } = useGetMetrics();

  const handleSignIn = () => {
    if (DisconnectInput) {
      localStorage.setItem("disconnectInput", DisconnectInput);
    }
    modal.show();
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
    if (accountId === null) {
      localStorage.setItem("disconnectInput", "");
    }
  }, []);

  return (
    <>
      <Container maxW="container.lg" className="flex">
        <Center>
          <VStack mb="20px" rowGap="10px">
            <SkeletonCircle boxSize="120px" isLoaded={metrics !== undefined}>
              {metrics && (
                <Apy
                  data={toStringDec2(metrics.st_near_30_day_apy)}
                  boxSize="120px"
                />
              )}
            </SkeletonCircle>
            <Heading
              as="h1"
              color="#0F172A"
              textAlign="center"
              fontSize="2em"
              fontWeight="500"
            >
              Stake NEAR
            </Heading>

            {!selector?.isSignedIn() ? (
              <InfoContainer>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="black"
                    fontSize="1.5em"
                    fontWeight="500"
                  >
                    Ⓝ
                  </InputLeftElement>
                  <Input
                    placeholder="Near amount"
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
