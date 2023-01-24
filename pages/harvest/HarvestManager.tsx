import { Dispatch, SetStateAction } from "react";
import { Button, Skeleton, Divider, Tooltip, Flex } from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetMetrics } from "../../hooks/useGetMetrics";
import { toStringDec, toStringDec2, yton } from "../../lib/util";
import TokenInfo from "../../components/TokenInfo";
import { useGetMetapoolAccountInfo } from "../../hooks/useGetMetapoolAccountInfo";
import { useGetNearDollarPrice } from "../../hooks/useGetNearDollarPrice";
import TokenInfoButton from "../../components/TokenInfoButton";
import { InfoContainer } from "../../components/InfoContainer";
import { InfoIcon } from "@chakra-ui/icons";
import {
  addTokenToWallet,
  CONTRACT_ID,
  META_CONTRACT_ID,
} from "../../lib/near";
import { useRouter } from "next/router";
import { harvestMeta } from "../../lib/metapool";
import { useTxSuccessStore } from "../../stores/txSuccessStore";
import { useErrorMsgStore } from "../../stores/ErrorMsgStore";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useQueryClient } from "react-query";

type Props = {
  buttonLoading: "" | "harvestButton" | "stNearButton" | "MetaButton";
  setButtonLoading: Dispatch<
    SetStateAction<"" | "harvestButton" | "stNearButton" | "MetaButton">
  >;
};

export const HarvestManager = ({ buttonLoading, setButtonLoading }: Props) => {
  const { setTxSuccess } = useTxSuccessStore();
  const { setErrorMsg } = useErrorMsgStore();

  const { accountId, selector } = useWalletSelector();

  const queryClient = useQueryClient();
  const { data: metrics } = useGetMetrics();
  const { data: accountInfo } = useGetMetapoolAccountInfo(accountId!);
  const { data: nearDollarPrice } = useGetNearDollarPrice();
  const router = useRouter();

  const handleGoToUnstake = () => {
    router.push("/unstake");
  };

  const handleHarvest = async () => {
    setButtonLoading("harvestButton");
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await harvestMeta(wallet, accountId);
      await queryClient.refetchQueries();
      setTxSuccess({ title: "$META Transferred To You NEAR Account" });
    } catch (ex) {
      const msg = getErrorMessage(ex);
      setErrorMsg(msg);
    } finally {
      setButtonLoading("");
    }
  };

  const handleAddStNear = async () => {
    setButtonLoading("stNearButton");
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await addTokenToWallet(wallet, accountId, CONTRACT_ID!);
    } catch (ex) {
      // is expected to fail
      const msg = getErrorMessage(ex);
      if (msg.includes("The account ID is invalid")) {
        setTxSuccess({ title: "stNEAR added to NEAR Web Wallet" });
      } else {
        setErrorMsg(msg);
      }
    }
    setButtonLoading("");
  };

  const handleAddMeta = async () => {
    setButtonLoading("MetaButton");
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error("account id undefined");
      }
      await addTokenToWallet(wallet, accountId, META_CONTRACT_ID!);
    } catch (ex) {
      // is expected to fail
      const msg = getErrorMessage(ex);
      if (msg.includes("The account ID is invalid")) {
        setTxSuccess({ title: "$META added to NEAR Web Wallet" });
      } else {
        setErrorMsg(msg);
      }
    }
    setButtonLoading("");
  };

  return (
    <InfoContainer>
      <TokenInfoButton
        description={`Your stNEAR Tokens: ${toStringDec(
          yton(accountInfo?.st_near!)
        )}`}
        isLoaded={accountInfo !== undefined}
        symbol="Ⓢ"
      >
        <Button
          colorScheme="purple"
          onClick={handleGoToUnstake}
          disabled={buttonLoading !== ""}
        >
          Liquid Unstake
        </Button>
      </TokenInfoButton>
      <Divider />
      <Skeleton
        isLoaded={accountInfo !== undefined && nearDollarPrice !== undefined}
      >
        <TokenInfo
          description="Your stNEAR in USD"
          tooltip="The amount of USD your stNEAR are worth"
          amount={toStringDec2(
            yton(accountInfo?.valued_st_near!) * nearDollarPrice
          )}
          symbol="$"
        />
      </Skeleton>
      <Divider />
      <Skeleton
        isLoaded={
          accountInfo !== undefined &&
          nearDollarPrice !== undefined &&
          metrics !== undefined
        }
      >
        <TokenInfo
          description="Est. Monthly Rewards"
          tooltip="Staking rewards are included in the stNEAR price. stNEAR price increases every 12 hours."
          amount={`${toStringDec(
            (yton(accountInfo?.st_near!) * metrics?.st_near_30_day_apy!) /
              100 /
              12
          )} Ⓝ / ${toStringDec(
            ((yton(accountInfo?.st_near!) * metrics?.st_near_30_day_apy!) /
              100 /
              12) *
              nearDollarPrice
          )} $`}
        />
      </Skeleton>
      <Divider />
      <Skeleton isLoaded={accountInfo !== undefined}>
        <TokenInfo
          description={`Staking Rewards Since ${new Date(
            Number(accountInfo?.trip_start!)
          ).toLocaleDateString()}`}
          amount={toStringDec(yton(accountInfo?.trip_rewards!))}
          symbol="Ⓝ"
        />
      </Skeleton>
      <Divider />
      <TokenInfoButton
        description={`$META Rewards: ${toStringDec(
          yton(accountInfo?.realized_meta! ?? accountInfo?.meta!)
        )}`}
        isLoaded={accountInfo !== undefined}
        symbol="Ⓜ"
      >
        <Button
          colorScheme="purple"
          onClick={handleHarvest}
          disabled={
            yton(accountInfo?.realized_meta! ?? accountInfo?.meta!) <= 0 ||
            buttonLoading !== ""
          }
          isLoading={buttonLoading === "harvestButton"}
          loadingText="Harvesting..."
          spinnerPlacement="end"
        >
          Harvest
        </Button>
      </TokenInfoButton>
      <Divider />
      <Button
        as={"a"}
        target="_blank"
        href="https://app.ref.finance/pool/1923"
        fontSize="15px"
        rightIcon={
          <Flex
            bg="whiteAlpha.900"
            color="green.600"
            p="4px"
            borderRadius="4px"
          >
            {`APR ${toStringDec2(metrics?.ref_meta_st_near_apr!)}%`}
          </Flex>
        }
        colorScheme="green"
        variant="solid"
        disabled={buttonLoading !== ""}
      >
        stNEAR-$META At Ref Finance
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleAddStNear}
        rightIcon={
          <Tooltip
            label={
              "Note: this button will create a 0 transfer instruction that will fail but the token will be added to the NEAR WEB Wallet nonetheless"
            }
          >
            <InfoIcon color="whiteAlpha.900" boxSize="12px" />
          </Tooltip>
        }
        disabled={buttonLoading !== ""}
        isLoading={buttonLoading === "stNearButton"}
        loadingText="Adding stNEAR..."
        spinnerPlacement="end"
      >
        Add stNEAR To NEAR WEB Wallet
      </Button>
      <Button
        colorScheme="purple"
        onClick={handleAddMeta}
        rightIcon={
          <Tooltip
            label={
              "Note: this button will create a 0 transfer instruction that will fail but the token will be added to the NEAR WEB Wallet nonetheless"
            }
          >
            <InfoIcon color="whiteAlpha.900" boxSize="12px" />
          </Tooltip>
        }
        disabled={buttonLoading !== ""}
        isLoading={buttonLoading === "MetaButton"}
        loadingText="Adding $META..."
        spinnerPlacement="end"
      >
        Add $META To NEAR WEB Wallet
      </Button>
    </InfoContainer>
  );
};
