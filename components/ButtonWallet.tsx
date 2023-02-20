import { Button } from "@chakra-ui/react";
import * as React from "react";
import { showShortAccountId } from "../lib/util";

import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork } from "wagmi";

type Props = React.ComponentProps<typeof Button>;

const ButtonWallet = (props: Props) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  if (address && chain) {
    const handleAccountClick = () => {
      if (chain.unsupported && openChainModal) {
        openChainModal();
      } else if (openAccountModal) {
        openAccountModal();
      }
    };

    return (
      <Button
        size="sm"
        color={chain.unsupported ? "red.600" : "purple.500"}
        variant="outline"
        onClick={handleAccountClick}
        minW="auto"
        {...props}
      >
        {chain.unsupported ? "Wrong Network" : showShortAccountId(address)}
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
