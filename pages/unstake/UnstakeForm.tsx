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
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { InfoIcon } from "@chakra-ui/icons";
import { toNumber, toStringDecMin, yton } from "../../lib/util";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { checkUnstakeErrorAmounts } from "../../services/transaction/checkUnstakeErrorAmounts.service";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { UnstakeModal } from "./UnstakeModal";
import { getUnstakeResultAsString } from "../../utils/unstakeHandlers";
import { AlertMsg } from "../../components/AlertMsg";
import { InfoContainer } from "../../components/InfoContainer";

export const UnstakeForm = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { selector, accountId } = useWalletSelector();

  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);
  const { data: contractState } = useGetMetapoolContractState();

  const handleMaxClick = () => {
    if (selector.isSignedIn() && accountInfo) {
      let maxStake = accountInfo.st_near;
      setInputValue(toStringDecMin(yton(maxStake)));
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
      accountInfo?.st_near!,
      contractState?.nslp_liquidity!
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
            w="55px"
            pointerEvents="none"
            color="black"
            fontWeight="500"
          >
            <Text fontSize="1em">st</Text>
            <Text fontSize="1.5em">Ⓝ</Text>
          </InputLeftElement>
          <Input
            pl="55px"
            placeholder="stNear amount to unstake"
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
        <Skeleton isLoaded={contractState !== undefined}>
          <Text textAlign="center">
            {toNumber(inputValue) <= 0
              ? `Fee ${
                  contractState?.nslp_current_discount_basis_points! / 100
                } %`
              : `Fee ${getUnstakeResultAsString(
                  toNumber(inputValue),
                  contractState!
                )}`}
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
            label={`In order to skip the waiting period a fee is charged for Liquid Unstaking.
        The fee varies based on the amount of liquidity available and the amount you want to unstake.`}
          >
            <InfoIcon />
          </Tooltip>
        </Flex>
      </InfoContainer>
      {contractState && inputValue !== "" && showUnstakeModal && (
        <UnstakeModal
          inputValue={inputValue}
          setInputValue={setInputValue}
          contractState={contractState}
          setShowUnstakeModal={setShowUnstakeModal}
          showUnstakeModal={showUnstakeModal}
        />
      )}
    </>
  );
};
