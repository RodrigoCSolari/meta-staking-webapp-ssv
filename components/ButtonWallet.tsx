import { Button } from "@chakra-ui/react";
import * as React from "react";
import { showShortAccountId } from "../lib/util";

import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

type Props = React.ComponentProps<typeof Button>;

const ButtonWallet = (props: Props) => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  if (address) {
    const handleAccountClick = () => {
      if (openAccountModal) {
        openAccountModal();
      }
    };

    return (
      <Button
        size="sm"
        color="purple.500"
        variant="outline"
        onClick={handleAccountClick}
        minW="auto"
        {...props}
      >
        {showShortAccountId(address)}
      </Button>
    );
  }

  const handleSignIn = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };
  return (
    <Button
      size="sm"
      colorScheme="purple"
      minW="auto"
      onClick={handleSignIn}
      {...props}
    >
      {"Connect Wallet"}
    </Button>
  );
};

export default ButtonWallet;
