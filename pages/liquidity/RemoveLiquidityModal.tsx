import {
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
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
import { wtoe } from "../../lib/util";
import { AlertMsg } from "../../components/AlertMsg";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useQueryClient } from "react-query";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";
import { useGetContractData } from "../../hooks/useGetContractData";
import { useAccount, useSigner } from "wagmi";
import { useGetEthereumBalance } from "../../hooks/useGetEthereumBalance";
import { withdraw } from "../../lib/metapool";
import { DetailsLink } from "../../components/DetailsLink";

type Props = {
  showRemoveLiquidityModal: boolean;
  setShowRemoveLiquidityModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RemoveLiquidityModal = ({
  showRemoveLiquidityModal,
  setShowRemoveLiquidityModal,
}: Props) => {
  const [closeEnabled, setcloseEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { setTxSuccess } = useTxSuccessStore();
  const { data: contractData } = useGetContractData();
  const { isConnected } = useAccount();
  const { data: ethereumBalance } = useGetEthereumBalance();
  const { data: signer } = useSigner();

  const queryClient = useQueryClient();

  const handleOnClose = () => {
    if (closeEnabled) {
      setInputValue("");
      setAlertMsg("");
      setErrorMsg("");
      setShowRemoveLiquidityModal(false);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = wtoe(contractData?.userBalance);
    setInputValue(maxAmount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRemoveLiquidityClick();
    }
  };

  const handleRemoveLiquidityClick = async () => {
    const errorMsg = checkTxErrorAmounts(
      inputValue,
      contractData?.userBalance!,
      contractData?.minEthDeposit!,
      "Remove"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    } else {
      setcloseEnabled(false);
      try {
        const resp = await withdraw(signer!, inputValue);
        await resp.wait();
        setInputValue("");
        await queryClient.refetchQueries();
        setTxSuccess({
          title: "Liquidity Removed Successfully",
          description: <DetailsLink hash={resp.hash} />,
        });
        handleOnClose();
      } catch (ex) {
        const msg = getErrorMessage(ex);
        setErrorMsg(msg);
      }
      setcloseEnabled(true);
    }
  };

  return (
    <Modal
      isOpen={showRemoveLiquidityModal}
      onClose={handleOnClose}
      closeOnEsc={closeEnabled}
      closeOnOverlayClick={closeEnabled}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remove Liquidity</ModalHeader>
        <ModalCloseButton display={closeEnabled ? undefined : "none"} />
        <ModalBody>
          <Text textAlign="center">
            {`Your Share Value: ${wtoe(contractData?.userBalance!)}`} Ⓔ
          </Text>
          <Flex flexDirection="column" rowGap="10px">
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
                placeholder="Amount"
                type="number"
                id="amountInput"
                onChange={handleInputChange}
                value={inputValue}
                disabled={!closeEnabled}
                onKeyDown={handleKeyDown}
              />
              <InputRightElement
                mx="5px"
                onClick={closeEnabled ? handleMaxClick : undefined}
              >
                <Text color="purple.500" cursor="pointer">
                  Max
                </Text>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <AlertMsg
            alertMsg={alertMsg}
            setAlertMsg={setAlertMsg}
            type="warning"
          />
          <AlertMsg
            alertMsg={errorMsg}
            setAlertMsg={setErrorMsg}
            type="error"
            isClosable
            time={Infinity}
          />
          <Flex justifyContent="end" columnGap="10px" mt="10px">
            <Button
              colorScheme="purple"
              onClick={handleRemoveLiquidityClick}
              isLoading={!closeEnabled}
              loadingText="Confirm..."
              spinnerPlacement="end"
            >
              Confirm
            </Button>
            <Button
              color="purple.500"
              variant="outline"
              onClick={handleOnClose}
              disabled={!closeEnabled}
            >
              Cancel
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter
          justifyContent="center"
          flexDirection="column"
          rowGap="10px"
        >
          <Divider />
          <Text fontSize="0.7em">
            {`By removing liquidity you'll receive ETHEREUM in proportion
            of your share of the liquidity pool.`}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
