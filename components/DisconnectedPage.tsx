import React, { ReactNode } from "react";
import { Container, Center, Heading, VStack } from "@chakra-ui/react";
import { InfoContainer } from "./InfoContainer";
import ButtonWallet from "./ButtonWallet";

type Props = {
  title: string;
  children?: ReactNode;
};

export const DisconnectedPage = ({ title, children }: Props) => {
  return (
    <>
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
              {title}
            </Heading>

            <InfoContainer>
              <ButtonWallet size="lg" />
            </InfoContainer>
            {children}
          </VStack>
        </Center>
      </Container>
    </>
  );
};
