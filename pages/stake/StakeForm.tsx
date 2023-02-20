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
  Link,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { stake } from "../../lib/metapool";
import { wtoe, wtoeCommify } from "../../lib/util";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { useErrorMsgStore } from "../../stores/ErrorMsgStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { AlertMsg } from "../../components/AlertMsg";
import { getMaxStakeAmount } from "../../utils/unstakeHandlers";
import { InfoContainer } from "../../components/InfoContainer";
import { useQueryClient } from "react-query";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";
import { useAccount, useSigner } from "wagmi";
import { useGetContractData } from "../../hooks/useGetContractData";
import { useGetEthereumBalance } from "../../hooks/useGetEthereumBalance";
import { DetailsLink } from "../../components/DetailsLink";

export const StakeForm = () => {
  const [alertMsg, setAlertMsg] = useState("");
  const [loadingStake, setLoadingStake] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { setErrorMsg } = useErrorMsgStore();
  const { setTxSuccess } = useTxSuccessStore();

  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const { data: contractData } = useGetContractData();
  const { data: ethereumBalance } = useGetEthereumBalance();

  const handleMaxClick = () => {
    if (!isConnected || ethereumBalance === undefined || loadingStake) {
      return;
    }
    let maxStakeAmount = getMaxStakeAmount(ethereumBalance);
    setInputValue(wtoe(maxStakeAmount));
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
      ethereumBalance!,
      contractData?.minEthDeposit!,
      "Stake"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    }
    try {
      setLoadingStake(true);
      const resp = await stake(signer!, inputValue);
      await resp.wait();
      await queryClient.refetchQueries();
      setInputValue("");
      setTxSuccess({
        title: "Tokens Staked Successfully",
        description: <DetailsLink hash={resp.hash} />,
      });
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setErrorMsg(errorMsg);
    }
    setLoadingStake(false);
  };

  useEffect(() => {
    const inputValue = localStorage.getItem("disconnectInput");
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
          Ⓔ
        </InputLeftElement>
        <Input
          placeholder="Ethereum amount"
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
        onClick={handleStakeClick}
        isLoading={loadingStake}
        loadingText="Staking..."
        spinnerPlacement="end"
      >
        {"Stake"}
      </Button>
      <Skeleton isLoaded={contractData !== undefined}>
        <Flex
          alignItems="center"
          justifyContent="center"
          columnGap="5px"
          cursor="default"
        >
          <Text>info</Text>
          <Tooltip
            label={`When you stake you get metaETHEREUM tokens. While you hold metaETHEREUM tokens, 
                  you get staking rewards at the end of every epoch. You can unstake at any time.
                  Min amount to stake: ${wtoeCommify(
                    contractData?.minEthDeposit
                  )} ETHER.`}
          >
            <InfoIcon />
          </Tooltip>
        </Flex>
      </Skeleton>
    </InfoContainer>
  );
};
