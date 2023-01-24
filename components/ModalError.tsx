import { WarningTwoIcon } from "@chakra-ui/icons";
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
import React from "react";
import { useErrorMsgStore } from "../stores/ErrorMsgStore";

export const ModalError = () => {
  const { errorMsg, setErrorMsg } = useErrorMsgStore();
  const handleOnClose = () => {
    setErrorMsg("");
  };
  return (
    <Modal isOpen={errorMsg !== ""} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection="column" alignItems="center">
            <WarningTwoIcon color={"yellow.500"} boxSize="40px" />
            <Text textAlign="center" fontSize="12px">
              {errorMsg}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={handleOnClose}
            variant="outline"
            color="purple.500"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
