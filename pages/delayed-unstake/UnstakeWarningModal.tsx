import {
  Button,
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
import { withdrawUnstaked } from "../../lib/metapool";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Props = {
  showUnstakeWarningModal: boolean;
  setShowUnstakeWarningModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UnstakeWarningModal = ({
  showUnstakeWarningModal,
  setShowUnstakeWarningModal,
}: Props) => {
  const [closeEnabled, setcloseEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { setTxSuccess } = useTxSuccessStore();

  const { selector, accountId } = useWalletSelector();

  const queryClient = useQueryClient();

  const handleOnClose = () => {
    if (closeEnabled) {
      setErrorMsg("");
      setShowUnstakeWarningModal(false);
    }
  };

  const handleWithdrawUnstake = async () => {
    setcloseEnabled(false);
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await withdrawUnstaked(wallet, accountId);
      await queryClient.refetchQueries();
      setTxSuccess({ title: "Unstaked Transferred To You NEAR Account" });
      handleOnClose();
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
    }
    setcloseEnabled(true);
  };

  return (
    <Modal
      isOpen={showUnstakeWarningModal}
      onClose={handleOnClose}
      closeOnEsc={closeEnabled}
      closeOnOverlayClick={closeEnabled}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Wait!</ModalHeader>
        <ModalCloseButton display={closeEnabled ? undefined : "none"} />
        <ModalBody>
          <Text textAlign="center" fontWeight="900">
            Your previous delayed-unstake is available.
          </Text>
          <Text textAlign="center" fontWeight="900">
            You should withdraw first
          </Text>
          <AlertMsg
            alertMsg={errorMsg}
            setAlertMsg={setErrorMsg}
            type="error"
            isClosable
            time={Infinity}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            onClick={handleWithdrawUnstake}
            isLoading={!closeEnabled}
            loadingText="Withdrawing Unstaked..."
            spinnerPlacement="end"
          >
            Withdraw Now
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
