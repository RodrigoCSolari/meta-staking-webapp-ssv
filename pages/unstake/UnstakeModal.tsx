import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FinalExecutionOutcome } from "@near-wallet-selector/core";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { AlertMsg } from "../../components/AlertMsg";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { liquidUnstake } from "../../lib/metapool";
import { MetapoolContractState } from "../../lib/metapool.types";
import { ntoy, toNumber, toStringDec } from "../../lib/util";
import { TxSuccess, useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  getUnstakeResultAsString,
  get_discount_basis_points,
  showUnstakeResult,
  stNearPrice,
} from "../../utils/unstakeHandlers";

type Props = {
  showUnstakeModal: boolean;
  setShowUnstakeModal: React.Dispatch<React.SetStateAction<boolean>>;
  contractState: MetapoolContractState;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export const UnstakeModal = ({
  showUnstakeModal,
  setShowUnstakeModal,
  contractState,
  inputValue,
  setInputValue,
}: Props) => {
  const [closeEnabled, setcloseEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { setTxSuccess } = useTxSuccessStore();

  const { selector, accountId } = useWalletSelector();

  const queryClient = useQueryClient();

  const handleOnClose = () => {
    if (closeEnabled) {
      setErrorMsg("");
      setShowUnstakeModal(false);
    }
  };

  const fee_bp = get_discount_basis_points(
    BigInt(contractState.nslp_liquidity),
    BigInt(ntoy(toNumber(inputValue))),
    contractState
  );

  const expectedMin =
    (((toNumber(inputValue) *
      stNearPrice(contractState.st_near_price) *
      (10000 - fee_bp)) /
      10000) *
      99) /
    100; //auto slippage 1%

  const handleUnstake = async () => {
    setcloseEnabled(false);
    setErrorMsg("");
    let result: FinalExecutionOutcome | null = null;

    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      result = await liquidUnstake(
        wallet,
        accountId,
        toNumber(inputValue),
        expectedMin
      );
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      setcloseEnabled(true);
      return;
    }

    let resultInfo: TxSuccess = { title: "Tokens unstaked successfully" };
    if (result) {
      try {
        resultInfo = await showUnstakeResult(result);
      } catch (error) {
        console.log(error);
      }
    }
    /*
    /this timeout is added to wait for the delay of near balance update, possibly due to poor performance of the nodes
    */
    setTimeout(async () => {
      await queryClient.refetchQueries();
      setTxSuccess(resultInfo);
      setcloseEnabled(true);
      setInputValue("");
      handleOnClose();
    }, 5000);
  };

  return (
    <Modal
      isOpen={showUnstakeModal}
      onClose={handleOnClose}
      closeOnEsc={closeEnabled}
      closeOnOverlayClick={closeEnabled}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Liquid Unstake</ModalHeader>
        <ModalCloseButton display={closeEnabled ? undefined : "none"} />

        <>
          <ModalBody>
            {fee_bp > 100 && (
              <Text color="red.600" textAlign="center">{`Warning: Fee is ${
                fee_bp / 100
              }%`}</Text>
            )}
            <Text textAlign="center">
              {`Liquid-unstake stⓃ ${toStringDec(toNumber(inputValue))}`}
            </Text>
            <Text textAlign="center">{`Fee is ${getUnstakeResultAsString(
              toNumber(inputValue),
              contractState
            )}`}</Text>
            <AlertMsg
              alertMsg={errorMsg}
              setAlertMsg={setErrorMsg}
              type="error"
              isClosable
              time={Infinity}
            />
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Text>Slippage: 1%</Text>
            <Flex>
              <Button
                colorScheme="purple"
                mr={3}
                onClick={handleUnstake}
                isLoading={!closeEnabled}
                loadingText="Unstaking..."
                spinnerPlacement="end"
              >
                Unstake
              </Button>
              <Button
                color="purple.500"
                variant="outline"
                mr={3}
                onClick={handleOnClose}
                disabled={!closeEnabled}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
