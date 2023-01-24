import { Flex, FlexProps, Text } from "@chakra-ui/react";
import React from "react";

type Props = FlexProps & {
  data: string;
};

export const Apy = ({ data, ...props }: Props) => {
  return (
    <Flex
      boxSize="120px"
      border="6px solid #A855F7"
      borderRadius="50%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <Text>APY</Text>

      <Text fontSize="2xl">{`${data}%`}</Text>
    </Flex>
  );
};
