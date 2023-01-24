import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Skeleton, Spacer, Text, Tooltip } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  description: string;
  isLoaded: boolean;
  symbol?: string;
  children?: ReactNode;
};

const TokenInfoButton: React.FC<Props> = ({
  description,
  isLoaded,
  symbol,
  children,
}: Props) => {
  return (
    <>
      <Skeleton isLoaded={isLoaded}>
        <Flex justifyContent="center">
          <Flex alignItems="center" columnGap="2px">
            <Text fontSize="1.1em">{description}</Text>
            {symbol && (
              <Text w="1.5em" textAlign="center">
                {symbol}
              </Text>
            )}
          </Flex>
        </Flex>
      </Skeleton>
      {children}
    </>
  );
};

export default TokenInfoButton;
