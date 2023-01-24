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
} from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { InfoIcon } from "@chakra-ui/icons";
import { toNumber, toStringDecMin, yton } from "../../lib/util";
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { checkUnstakeErrorAmounts } from "../../services/transaction/checkUnstakeErrorAmounts.service";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { UnstakeModal } from "./UnstakeModal";
import { computeCurrentUnstakingDelay } from "../../lib/metapool";
import { HOURS } from "../../constants";
import { useGetEpochInfo } from "../../hooks/useGetEpochInfo";
import { UnstakeWarningModal } from "./UnstakeWarningModal";
import { AlertMsg } from "../../components/AlertMsg";
import { InfoContainer } from "../../components/InfoContainer";
import { useState } from "react";

type Props = {
  buttonLoading: "" | "unstakeButton" | "withdrawButton";
  setButtonLoading: React.Dispatch<
    React.SetStateAction<"" | "unstakeButton" | "withdrawButton">
  >;
};

export const DelayedUnstakeForm = ({
  buttonLoading,
  setButtonLoading,
}: Props) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [computedMsg, setComputedMsg] = useState("");
  const [LoadingEpoch, setLoadingEpoch] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showUnstakeWarningModal, setShowUnstakeWarningModal] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { selector, accountId } = useWalletSelector();

  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);
  const { data: EpochInfo } = useGetEpochInfo();
  const { data: contractState } = useGetMetapoolContractState();

  const handleMaxClick = () => {
    if (!selector.isSignedIn() || accountInfo === undefined || LoadingEpoch) {
      return;
    }
    let maxUnstake = accountInfo.valued_st_near;
    setInputValue(toStringDecMin(yton(maxUnstake)));
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
    if (accountInfo?.unstaked !== "0" && accountInfo?.can_withdraw) {
      setShowUnstakeWarningModal(true);
      return;
    }

    const errorMessage = checkUnstakeErrorAmounts(
      inputValue,
      accountInfo?.valued_st_near!
    );

    if (errorMessage) {
      setAlertMsg(errorMessage);
      return;
    }

    try {
      setLoadingEpoch(true);
      setButtonLoading("unstakeButton");
      const wait_epochs = await computeCurrentUnstakingDelay(
        toNumber(inputValue)
      );
      const ms_to_end_of_epoch =
        EpochInfo!.endOfEpochCached.getTime() - new Date().getTime();
      const extra_time = (wait_epochs - 1) * EpochInfo!.epochDurationMs;
      setComputedMsg(
        `Funds will be available in approximately ${Math.round(
          (ms_to_end_of_epoch + extra_time) / HOURS + 2
        )} hours. You will NOT receive rewards during that period.`
      );
    } catch (ex: any) {
      console.error(ex);
      setComputedMsg(ex.message);
    }
    setButtonLoading("");
    setLoadingEpoch(false);
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
            Ⓝ
          </InputLeftElement>
          <Input
            placeholder="Near amount to unstake"
            type="number"
            id="unstakeInput"
            onChange={handleInputChange}
            value={inputValue}
            disabled={buttonLoading === "unstakeButton"}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement
            mx="5px"
            onClick={handleMaxClick}
            cursor={
              buttonLoading === "unstakeButton" ? "not-allowed" : "pointer"
            }
          >
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
        <Button
          colorScheme="purple"
          onClick={handleUnstakeClick}
          disabled={buttonLoading !== ""}
          isLoading={buttonLoading === "unstakeButton"}
          loadingText="Computing epoch info..."
          spinnerPlacement="end"
        >
          Start Delayed Unstake
        </Button>
        <Flex
          alignItems="center"
          justifyContent="center"
          columnGap="5px"
          cursor="default"
        >
          <Text>info</Text>
          <Tooltip
            label={`Delayed unstake will lock your funds for 2-6 days. You will not receive rewards during that period. After the waiting period is over, your funds will be available for withdraw.`}
          >
            <InfoIcon />
          </Tooltip>
        </Flex>
      </InfoContainer>

      {contractState && inputValue !== "" && computedMsg !== "" && (
        <UnstakeModal
          inputValue={toNumber(inputValue)}
          computedMsg={computedMsg}
          setShowUnstakeModal={setShowUnstakeModal}
          showUnstakeModal={showUnstakeModal}
          setInputValue={setInputValue}
        />
      )}
      <UnstakeWarningModal
        setShowUnstakeWarningModal={setShowUnstakeWarningModal}
        showUnstakeWarningModal={showUnstakeWarningModal}
      />
    </>
  );
};
