import React, { useState } from "react";
import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Text,
  Tooltip,
  Skeleton,
  Box,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { wtoe } from "../../lib/util";
import { checkUnstakeErrorAmounts } from "../../services/transaction/checkUnstakeErrorAmounts.service";
import { UnstakeModal } from "./UnstakeModal";
import { AlertMsg } from "../../components/AlertMsg";
import { InfoContainer } from "../../components/InfoContainer";
import { useGetContractData } from "../../hooks/useGetContractData";
import { useAccount } from "wagmi";

export const UnstakeForm = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: contractData } = useGetContractData();
  const { isConnected } = useAccount();

  const handleMaxClick = () => {
    if (isConnected && contractData) {
      setInputValue(wtoe(contractData?.userBalance));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUnstakeClick();
    }
  };

  const handleUnstakeClick = async () => {
    const errorMsg = checkUnstakeErrorAmounts(
      inputValue,
      contractData?.userBalance!
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    }
    setShowUnstakeModal(true);
  };

  return (
    <>
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
            placeholder="ETHEREUM amount to unstake"
            type="number"
            id="unstakeInput"
            onChange={handleInputChange}
            value={inputValue}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement mx="5px" onClick={handleMaxClick}>
            <Text color="purple.500" cursor="pointer">
              Max
            </Text>
          </InputRightElement>
        </InputGroup>
        <Box mt="-10px">
          <AlertMsg
            alertMsg={alertMsg}
            setAlertMsg={setAlertMsg}
            type="warning"
          />
        </Box>
        <Skeleton isLoaded={contractData !== undefined}>
          <Text textAlign="center">
            {`Fee ${contractData?.withdrawFee! / 100} %`}
          </Text>
        </Skeleton>
        <Button colorScheme="purple" onClick={handleUnstakeClick}>
          Liquid Unstake
        </Button>
        <Flex
          alignItems="center"
          justifyContent="center"
          columnGap="5px"
          cursor="default"
        >
          <Text>info</Text>
          <Tooltip
            label={`The fee varies based on the amount of liquidity available and the amount you want to unstake.`}
          >
            <InfoIcon />
          </Tooltip>
        </Flex>
      </InfoContainer>
      {contractData && inputValue !== "" && showUnstakeModal && (
        <UnstakeModal
          inputValue={inputValue}
          setInputValue={setInputValue}
          contractData={contractData}
          setShowUnstakeModal={setShowUnstakeModal}
          showUnstakeModal={showUnstakeModal}
        />
      )}
    </>
  );
};
