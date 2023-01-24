import { Button } from "@chakra-ui/react";
import { useWalletSelector } from "../../contexts/WalletSelectorContext";
import { useGetNearBalance } from "../../hooks/useGetNearBalance";
import { toStringDec, yton } from "../../lib/util";
import TokenInfoButton from "../../components/TokenInfoButton";
import { InfoContainer } from "../../components/InfoContainer";
import { signOut } from "../../lib/near";

type Props = {
  buttonLoading: "" | "harvestButton" | "stNearButton" | "MetaButton";
};

export const NearStats = ({ buttonLoading }: Props) => {
  const { selector, accountId } = useWalletSelector();

  const { data: nearBalance } = useGetNearBalance(accountId!);

  const handleSignOut = async () => {
    signOut(selector);
  };

  return (
    <InfoContainer>
      <TokenInfoButton
        description={`Available NEAR Wallet: ${toStringDec(
          yton(nearBalance!),
          2
        )}`}
        isLoaded={nearBalance !== undefined}
        symbol="Ⓝ"
      >
        <Button
          colorScheme="purple"
          disabled={buttonLoading !== ""}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </TokenInfoButton>
    </InfoContainer>
  );
};
