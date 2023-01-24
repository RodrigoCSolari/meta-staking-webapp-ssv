import { Button, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { InfoContainer } from "../../components/InfoContainer";
import TokenInfoButton from "../../components/TokenInfoButton";
import { HOURS } from "../../constants";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetEpochInfo } from "../../hooks/useGetEpochInfo";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { withdrawUnstaked } from "../../lib/metapool";
import { toStringDec, yton } from "../../lib/util";
import { useErrorMsgStore } from "../../stores/ErrorMsgStore";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Props = {
  buttonLoading: "" | "unstakeButton" | "withdrawButton";
  setButtonLoading: React.Dispatch<
    React.SetStateAction<"" | "unstakeButton" | "withdrawButton">
  >;
};

export const DelayedUnstakeStats = ({
  buttonLoading,
  setButtonLoading,
}: Props) => {
  const [unstakeHours, setUnstakeHours] = useState("");
  const [unstakeDate, setUnstakeDate] = useState("");

  const { setTxSuccess } = useTxSuccessStore();
  const { setErrorMsg } = useErrorMsgStore();

  const { accountId, selector } = useWalletSelector();

  const queryClient = useQueryClient();
  const { data: epochInfo } = useGetEpochInfo();
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);

  const handleWithdrawUnstake = async () => {
    setButtonLoading("withdrawButton");
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await withdrawUnstaked(wallet, accountId);
      await queryClient.refetchQueries();
      setTxSuccess({ title: "Unstaked Transferred To You NEAR Account" });
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
    }
    setButtonLoading("");
  };

  useEffect(() => {
    if (accountInfo?.can_withdraw) {
      setUnstakeHours("0");
    } else {
      if (epochInfo?.endOfEpochCached) {
        const ms_to_end_of_epoch = Math.max(
          0,
          epochInfo!.endOfEpochCached.getTime() - new Date().getTime()
        );
        const extra_time =
          accountInfo!.unstake_full_epochs_wait_left > 0
            ? (accountInfo!.unstake_full_epochs_wait_left - 1) *
              epochInfo!.epochDurationMs
            : 0;
        setUnstakeHours(
          Math.trunc((ms_to_end_of_epoch + extra_time) / HOURS + 2).toString()
        );
        setUnstakeDate(
          new Date(
            epochInfo!.endOfEpochCached.getTime() + extra_time + HOURS
          ).toLocaleString()
        );
      }
    }
  }, [epochInfo]);

  if (!accountInfo || accountInfo.unstaked === "0") {
    return <></>;
  }

  return (
    <InfoContainer>
      <TokenInfoButton
        description={`Unstaked Waiting: ${toStringDec(
          yton(accountInfo?.unstaked!)
        )}`}
        isLoaded={accountInfo !== undefined}
        symbol="Ⓝ"
      />
      <Divider />
      <TokenInfoButton
        description={
          unstakeHours === "0"
            ? "Withdraw Available"
            : `Hours Remaining: ~${unstakeHours} Hs`
        }
        isLoaded={accountInfo !== undefined && epochInfo !== undefined}
      >
        <Button
          colorScheme="purple"
          onClick={handleWithdrawUnstake}
          disabled={!accountInfo?.can_withdraw || buttonLoading !== ""}
          isLoading={buttonLoading === "withdrawButton"}
          loadingText="Withdrawing Unstaked..."
          spinnerPlacement="end"
        >
          Withdraw
        </Button>
      </TokenInfoButton>
      {!accountInfo?.can_withdraw && (
        <>
          <Divider />
          <Flex alignItems="center" justifyContent="center">
            <Text fontSize="1.1em">{`${unstakeDate} Wait Finishes`}</Text>
          </Flex>
        </>
      )}
    </InfoContainer>
  );
};
