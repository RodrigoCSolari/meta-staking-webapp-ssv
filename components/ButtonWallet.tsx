import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { signOut } from "../lib/near";
import { showShortAccountId } from "../lib/util";

type Props = React.ComponentProps<typeof Button>;

const ButtonWallet = (props: Props) => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const router = useRouter();

  if (!selector.isSignedIn()) {
    const handleSignIn = () => {
      modal.show();
    };
    return (
      <Button
        size="sm"
        colorScheme="purple"
        minW="auto"
        onClick={() => handleSignIn()}
        {...props}
      >
        {"Connect Wallet"}
      </Button>
    );
  }

  if (accountId) {
    return (
      <Button
        size="sm"
        color="purple.500"
        variant="outline"
        onClick={() => router.push("/harvest")}
        minW="auto"
        {...props}
      >
        {showShortAccountId(accountId)}
      </Button>
    );
  }

  const handleSignOut = async () => {
    signOut(selector);
  };

  return (
    <Button
      size="sm"
      colorScheme="purple.500"
      minW="auto"
      onClick={() => handleSignOut()}
      {...props}
    >
      {"Disconnect Wallet"}
    </Button>
  );
};

export default ButtonWallet;
