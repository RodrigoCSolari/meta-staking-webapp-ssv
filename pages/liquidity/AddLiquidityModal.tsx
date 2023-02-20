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
import { wtoe, wtoeCommify } from "../../lib/util";
import { AlertMsg } from "../../components/AlertMsg";
import { getMaxStakeAmount } from "../../utils/unstakeHandlers";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { useQueryClient } from "react-query";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";
import { useGetContractData } from "../../hooks/useGetContractData";
import { stake } from "../../lib/metapool";
import { useSigner } from "wagmi";
import { useGetEthereumBalance } from "../../hooks/useGetEthereumBalance";
import { DetailsLink } from "../../components/DetailsLink";

type Props = {
  showAddLiquidityModal: boolean;
  setShowAddLiquidityModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AddLiquidityModal = ({
  showAddLiquidityModal,
  setShowAddLiquidityModal,
}: Props) => {
  const [closeEnabled, setcloseEnabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { setTxSuccess } = useTxSuccessStore();

  const queryClient = useQueryClient();

  const { data: contractData } = useGetContractData();
  const { data: signer } = useSigner();
  const { data: ethereumBalance } = useGetEthereumBalance();

  const handleOnClose = () => {
    if (closeEnabled) {
      setInputValue("");
      setAlertMsg("");
      setErrorMsg("");
      setShowAddLiquidityModal(false);
    }
  };

  const handleMaxClick = () => {
    if (ethereumBalance === undefined) {
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
      handleAddLiquidityClick();
    }
  };

  const handleAddLiquidityClick = async () => {
    const errorMsg = checkTxErrorAmounts(
      inputValue,
      ethereumBalance!,
      contractData?.minEthDeposit!,
      "Add"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    }
    setcloseEnabled(false);
    try {
      const resp = await stake(signer!, inputValue);
      await resp.wait();
      await queryClient.refetchQueries();
      setInputValue("");
      setTxSuccess({
        title: "Liquidity Added Successfully",
        description: <DetailsLink hash={resp.hash} />,
      });
      handleOnClose();
    } catch (ex) {
      const msg = getErrorMessage(ex);
      setErrorMsg(msg);
    }
    setcloseEnabled(true);
  };

  return (
    <Modal
      isOpen={showAddLiquidityModal}
      onClose={handleOnClose}
      closeOnEsc={closeEnabled}
      closeOnOverlayClick={closeEnabled}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Liquidity</ModalHeader>
        <ModalCloseButton display={closeEnabled ? undefined : "none"} />
        <ModalBody>
          <Text textAlign="center">{`Available ${wtoeCommify(
            ethereumBalance!
          )} Ⓔ - Min.Amount ${wtoe(
            contractData?.minEthDeposit
          ).toString()} Ⓔ`}</Text>
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
              onClick={handleAddLiquidityClick}
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
            {`By adding liquidity you'll receive a share of the liquidity pool. On
            each liquid unstake you'll get a proportion of the fees.`}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
