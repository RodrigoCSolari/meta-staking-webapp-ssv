import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const InfoContainer: React.FC<ReactNode> = ({ children }) => {
  return (
    <Flex
      bg="whiteAlpha.900"
      p="16px"
      borderRadius="8px"
      flexDirection="column"
      rowGap="6px"
      boxShadow="0 0 5px #8888"
      w={{ base: "360px", md: "480px" }}
      fontSize={{ base: "0.9em", md: "1em" }}
    >
      {children}
    </Flex>
  );
};
