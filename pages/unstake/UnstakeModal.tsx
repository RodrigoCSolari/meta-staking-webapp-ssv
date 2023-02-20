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
import { commify } from "ethers/lib/utils.js";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSigner } from "wagmi";
import { AlertMsg } from "../../components/AlertMsg";
import { DetailsLink } from "../../components/DetailsLink";
import { withdraw } from "../../lib/metapool";
import { ContractData } from "../../lib/metapool.types";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

type Props = {
  showUnstakeModal: boolean;
  setShowUnstakeModal: React.Dispatch<React.SetStateAction<boolean>>;
  contractData: ContractData;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export const UnstakeModal = ({
  showUnstakeModal,
  setShowUnstakeModal,
  contractData,
  inputValue,
  setInputValue,
}: Props) => {
  const [closeEnabled, setcloseEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const { setTxSuccess } = useTxSuccessStore();
  const { data: signer } = useSigner();

  const queryClient = useQueryClient();

  const handleOnClose = () => {
    if (closeEnabled) {
      setErrorMsg("");
      setShowUnstakeModal(false);
    }
  };

  const handleUnstake = async () => {
    setcloseEnabled(false);
    setErrorMsg("");

    try {
      const resp = await withdraw(signer!, inputValue);
      await resp.wait();
      await queryClient.refetchQueries();
      setTxSuccess({
        title: "Tokens unstaked successfully",
        description: <DetailsLink hash={resp.hash} />,
      });
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      setcloseEnabled(true);
      return;
    }

    setcloseEnabled(true);
    setInputValue("");
    handleOnClose();
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
            {contractData.withdrawFee > 100 && (
              <Text color="red.600" textAlign="center">{`Warning: Fee is ${
                contractData.withdrawFee / 100
              }%`}</Text>
            )}
            <Text textAlign="center">{`unstake Ⓔ ${commify(inputValue)}`}</Text>
            {/* <Text textAlign="center">{`Fee is ${getUnstakeResultAsString(
              toNumber(inputValue),
              contractState
            )}`}</Text> */}
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
