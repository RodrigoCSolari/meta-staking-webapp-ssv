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
import { useGetMetapoolContractState } from "../../hooks/useGetMetapoolContractState";
import { useGetNearBalance } from "../../hooks/useGetNearBalance";
import { nslpAddLiquidity } from "../../lib/metapool";
import { toNumber, toStringDec, toStringDecMin, yton } from "../../lib/util";
import { AlertMsg } from "../../components/AlertMsg";
import { getMaxStakeAmount } from "../../utils/unstakeHandlers";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { useQueryClient } from "react-query";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { checkTxErrorAmounts } from "../../services/transaction/checkTxErrorAmounts.service";

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
  const { accountId, selector } = useWalletSelector();

  const queryClient = useQueryClient();
  const { data: contractState } = useGetMetapoolContractState();
  const { data: nearBalance } = useGetNearBalance(accountId!);
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);

  const handleOnClose = () => {
    if (closeEnabled) {
      setInputValue("");
      setAlertMsg("");
      setErrorMsg("");
      setShowAddLiquidityModal(false);
    }
  };

  const handleMaxClick = () => {
    let maxDepositAmount = getMaxStakeAmount(nearBalance!);
    setInputValue(toStringDecMin(yton(maxDepositAmount)));
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
      nearBalance!,
      yton(contractState?.min_deposit_amount!) * 2,
      "Add"
    );
    if (errorMsg) {
      setAlertMsg(errorMsg);
      return;
    }
    setcloseEnabled(false);
    try {
      const amount = toNumber(inputValue);
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await nslpAddLiquidity(wallet, accountId, amount);
      setInputValue("");
      await queryClient.refetchQueries();
      setTxSuccess({
        title: "Liquidity Added Successfully",
        description: `You Own ${
          accountInfo?.nslp_share_bp! == 0
            ? "<0.01"
            : toStringDecMin(accountInfo?.nslp_share_bp! / 100)
        }% Of The Liquidity Pool`,
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
          <Text textAlign="center">{`Available ${toStringDec(
            yton(nearBalance!),
            2
          )} Ⓝ - Min.Amount ${(
            yton(contractState?.min_deposit_amount!) * 2
          ).toString()} Ⓝ`}</Text>
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
            each liquid unstake you'll get a proportion of the fees and also
            $META tokens`}
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
