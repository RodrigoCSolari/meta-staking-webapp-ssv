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
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { nslpRemoveLiquidity } from "../../lib/metapool";
import { toNumber, toStringDec, toStringDecMin, yton } from "../../lib/util";
import { FinalExecutionOutcome } from "@near-wallet-selector/core";
import { getTransactionLastResult } from "near-api-js/lib/providers";
import { AlertMsg } from "../../components/AlertMsg";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useQueryClient } from "react-query";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";

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
  const { accountId, selector } = useWalletSelector();

  const queryClient = useQueryClient();
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);

  const handleOnClose = () => {
    if (closeEnabled) {
      setInputValue("");
      setAlertMsg("");
      setErrorMsg("");
      setShowRemoveLiquidityModal(false);
    }
  };

  const handleMaxClick = () => {
    const maxAmount = toStringDecMin(yton(accountInfo?.nslp_share_value!));
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
      accountInfo?.nslp_share_value!,
      0,
      "Stake"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    } else {
      setcloseEnabled(false);
      try {
        const amount = toNumber(inputValue);
        const wallet = await selector.wallet();
        if (!accountId) {
          throw Error("account id undefined");
        }
        let result = await nslpRemoveLiquidity(wallet, accountId, amount);
        setInputValue("");
        await queryClient.refetchQueries();
        if (result && "receipts_outcome" in result) {
          const resultFinalExecOutcome = result as FinalExecutionOutcome;
          let txResult: { near: string; st_near: string } =
            getTransactionLastResult(resultFinalExecOutcome);
          setTxSuccess({
            title: "Liquidity Removed Successfully",
            description: (
              <>
                <Text textAlign="center">{`NEAR Received: ${toStringDec(
                  yton(txResult.near)
                )} Ⓝ`}</Text>
                <Text textAlign="center">{`stNEAR Received: ${toStringDec(
                  yton(txResult.st_near)
                )} Ⓢ`}</Text>
              </>
            ),
          });
        }
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
            {`Your Share Value: ${toStringDec(
              yton(accountInfo?.nslp_share_value!)
            )}`}{" "}
            Ⓝ
          </Text>
          <Flex flexDirection="column" rowGap="10px">
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
            {`By removing liquidity you'll receive NEAR and stNEAR in proportion
            of your share of the liquidity pool.`}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
