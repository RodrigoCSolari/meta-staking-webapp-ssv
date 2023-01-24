import {
  Button,
  Divider,
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
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { AlertMsg } from "../../components/AlertMsg";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { unstake } from "../../lib/metapool";
import { toStringDec } from "../../lib/util";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Props = {
  showUnstakeModal: boolean;
  setShowUnstakeModal: React.Dispatch<React.SetStateAction<boolean>>;
  computedMsg: string;
  inputValue: number;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export const UnstakeModal = ({
  showUnstakeModal,
  setShowUnstakeModal,
  computedMsg,
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

  const handleUnstake = async () => {
    setcloseEnabled(false);
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await unstake(wallet, accountId, inputValue);
      setInputValue("");
      await queryClient.refetchQueries();
      setTxSuccess({ title: "Delayed Unstake Process Started Successfully" });
      handleOnClose();
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
    }
    setcloseEnabled(true);
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
        <ModalHeader>Start Delayed Unstake</ModalHeader>
        <ModalCloseButton display={closeEnabled ? undefined : "none"} />
        <>
          <ModalBody>
            <Text textAlign="center">{computedMsg}</Text>
            <Divider my="10px" />
            <Text textAlign="center">
              {`Start delayed-unstake process for Ⓝ ${toStringDec(inputValue)}`}
            </Text>
            <AlertMsg
              alertMsg={errorMsg}
              setAlertMsg={setErrorMsg}
              type="error"
              isClosable
              time={Infinity}
            />
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Flex flexDirection="column" rowGap="10px">
              <Flex justifyContent="end">
                <Button
                  colorScheme="purple"
                  mr={3}
                  onClick={handleUnstake}
                  isLoading={!closeEnabled}
                  loadingText="Confirm..."
                  spinnerPlacement="end"
                >
                  Confirm
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
              <Divider />
              <Text fontSize="0.7em">
                After the waiting period is over, the funds will be available
                for withdraw.
              </Text>
            </Flex>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
