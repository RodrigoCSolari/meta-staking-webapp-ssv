import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Spacer, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

type Props = {
  description: string;
  tooltip?: string;
  amount?: string;
  symbol?: string;
};

const TokenInfo = ({ description, tooltip, amount, symbol }: Props) => {
  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center" columnGap="5px">
        <Text fontSize="0.85em">{description}</Text>
        {tooltip && (
          <Tooltip label={tooltip}>
            <InfoIcon color="blackAlpha.500" boxSize="12px" />
          </Tooltip>
        )}
      </Flex>
      <Flex>
        <Text>{amount}</Text>
        {symbol ? (
          <Text w="1.5em" textAlign="center">
            {symbol}
          </Text>
        ) : (
          <Spacer w=".5em" />
        )}
      </Flex>
    </Flex>
  );
};

export default TokenInfo;
