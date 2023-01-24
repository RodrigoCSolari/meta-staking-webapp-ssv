import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Text,
  Tooltip,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { InfoIcon } from "@chakra-ui/icons";
import { depositAndStake } from "../../lib/metapool";
import { useGetNearBalance } from "../../hooks/useGetNearBalance";
import { toNumber, toStringDecMin, yton } from "../../lib/util";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { useErrorMsgStore } from "../../stores/ErrorMsgStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { AlertMsg } from "../../components/AlertMsg";
import { getMaxStakeAmount } from "../../utils/unstakeHandlers";
import { InfoContainer } from "../../components/InfoContainer";
import { useQueryClient } from "react-query";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";

export const StakeForm = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [loadingStake, setLoadingStake] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { setErrorMsg } = useErrorMsgStore();
  const { setTxSuccess } = useTxSuccessStore();

  const { modal, selector, accountId } = useWalletSelector();

  const queryClient = useQueryClient();
  const { data: nearBalance } = useGetNearBalance(accountId!);
  const { data: contractState } = useGetMetapoolContractState();

  const handleSignIn = () => {
    modal.show();
  };

  const handleMaxClick = () => {
    if (!selector.isSignedIn() || nearBalance === undefined || loadingStake) {
      return;
    }
    let maxStakeAmount = getMaxStakeAmount(nearBalance);
    setInputValue(toStringDecMin(yton(maxStakeAmount)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleStakeClick();
    }
  };

  const handleStakeClick = async () => {
    const errorMsg = checkTxErrorAmounts(
      inputValue,
      nearBalance!,
      yton(contractState?.min_deposit_amount!),
      "Stake"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    }
    try {
      setLoadingStake(true);
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await depositAndStake(wallet, accountId, toNumber(inputValue));
      await queryClient.refetchQueries();
      setInputValue("");
      setTxSuccess({ title: "Tokens Staked Successfully" });
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setErrorMsg(errorMsg);
    }
    setLoadingStake(false);
  };

  useEffect(() => {
    const inputValue = localStorage.getItem("disconnectInput");
    console.log(inputValue);
    if (inputValue) {
      setInputValue(inputValue);
      localStorage.setItem("disconnectInput", "");
    }
  }, []);

  return (
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
          onChange={handleInputChange}
          value={inputValue}
          disabled={loadingStake}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement
          mx="5px"
          onClick={handleMaxClick}
          cursor={loadingStake ? "not-allowed" : "pointer"}
        >
          <Text color="purple.500">Max</Text>
        </InputRightElement>
      </InputGroup>
      <Box mt="-10px">
        <AlertMsg
          alertMsg={alertMsg}
          setAlertMsg={setAlertMsg}
          type="warning"
        />
      </Box>
      <Button
        colorScheme="purple"
        onClick={selector.isSignedIn() ? handleStakeClick : handleSignIn}
        isLoading={loadingStake}
        loadingText="Staking..."
        spinnerPlacement="end"
      >
        {selector.isSignedIn() ? "Stake" : "Choose A Wallet To Stake"}
      </Button>
      <Skeleton isLoaded={contractState !== undefined}>
        <Flex
          alignItems="center"
          justifyContent="center"
          columnGap="5px"
          cursor="default"
        >
          <Text>info</Text>
          <Tooltip
            label={`When you stake you get stNEAR tokens. While you hold stNEAR tokens, 
                  you get staking rewards at the end of every epoch. You can unstake at any time.
                  Min amount to stake: ${yton(
                    contractState?.min_deposit_amount!
                  )} NEAR.`}
          >
            <InfoIcon />
          </Tooltip>
        </Flex>
      </Skeleton>
    </InfoContainer>
  );
};
