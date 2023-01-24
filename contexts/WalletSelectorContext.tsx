import React, { useCallback, useContext, useEffect, useState } from "react";
import { map, distinctUntilChanged } from "rxjs";
import {
  NetworkId,
  setupWalletSelector,
  Wallet,
} from "@near-wallet-selector/core";
import type { WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import {
  NearWalletParams,
  setupNearWallet,
} from "@near-wallet-selector/near-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
// import { setupNightlyConnect } from "@near-wallet-selector/nightly-connect";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { CONTRACT_ID, env, NETWORK_ID } from "../lib/near";
import { getConfig } from "../config";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
    account_id: string | null;
    wallet: Wallet | null;
    selectedWalletId: WALLETID;
  }
}

enum WALLETID {
  NearWallet = "near-wallet",
  MathWallet = "math-wallet",
  Nightly = "nightly",
  WalletConnect = "wallet-connect",
}

interface WalletSelectorContextValue {
  selector: WalletSelector;
  modal: WalletSelectorModal;
  accounts: Array<AccountState>;
  accountId: string | null;
}

enum Wallets {
  Near = "near",
  MyNearWallet = "mynearwallet",
  Sender = "sender",
  Math = "math",
  Nightly = "nightly",
  WalletConnect = "walletconnect",
  NightlyConnect = "nightlyconnect",
  Ledger = "ledger",
  Here = "here",
  Meteor = "meteor"
}

const WalletSelectorContext =
  React.createContext<WalletSelectorContextValue | null>(null);

export const WalletSelectorContextProvider: React.FC = ({ children }) => {
  const nearConfig = getConfig(env);
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const DEFAULT_ENABLE_WALLETS = [
    "meteor",
    "near",
    "mynearwallet",
    "math",
    "nightly",
    "walletconnect",
    "here",
  ];

  const setupWallets = () => {
    let modules: any[] = [];
    const enableWallets = DEFAULT_ENABLE_WALLETS;
    enableWallets.forEach((w: string) => {
      switch (w) {
        case Wallets.Meteor: {
          modules.push(
            setupMeteorWallet()
          );
          break
        }
        case Wallets.Near: {
          modules.push(
            setupNearWallet({
              walletUrl: nearConfig.walletUrl,
              iconUrl: "/assets/near-wallet-icon.png",
            })
          );
          break;
        }
        case Wallets.MyNearWallet: {
          modules.push(
            setupMyNearWallet({
              walletUrl: nearConfig.walletUrl,
              iconUrl: "/assets/my-near-wallet-icon.png",
            })
          );
          break;
        }
        case Wallets.Math: {
          modules.push(
            setupMathWallet({ iconUrl: "/assets/math-wallet-icon.png" })
          );
          break;
        }
        case Wallets.Ledger: {
          modules.push(setupLedger());
        }
        case Wallets.Nightly: {
          modules.push(setupNightly());
        }
        case Wallets.Here: {
          modules.push(setupHereWallet());
        }
        case Wallets.WalletConnect: {
          modules.push(
            setupWalletConnect({
              projectId:
                process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ||
                "3ec2226fd3f38b6fb82e789fcfc232bf",
              metadata: {
                name: "NEAR Wallet Selector for Meta Stake",
                description:
                  "Wallet Connect integration on Wallet Selector for Meta Stake",
                url: "https://metapool.app/dapp/mainnet/meta/",
                icons: ["https://avatars.githubusercontent.com/u/37784886"],
              },
              chainId: `near:${NETWORK_ID}`,
              iconUrl: "/assets/wallet-connect-icon.png",
            })
          );
        }
        // case Wallets.NightlyConnect: {
        //   modules.push(
        //     setupNightlyConnect({
        //       url: "wss://ncproxy.nightly.app/app",
        //       iconUrl: '/assets/nightly-connect-png',
        //       appMetadata: {
        //         additionalInfo: "",
        //         application: "NEAR Wallet Selector for Meta Stake",
        //         description:
        //           "Nightly Connect integration on Wallet Selector for Meta Stake",
        //         icon: "https://near.org/wp-content/uploads/2020/09/cropped-favicon-192x192.png",
        //       },
        //     })
        //   );
        // }
      }
    });
    return modules;
  };

  const init = useCallback(async () => {
    const _selector = await setupWalletSelector({
      network: NETWORK_ID as NetworkId,
      debug: true,
      modules: setupWallets(),
    });

    const _modal = setupModal(_selector, { contractId: CONTRACT_ID || "" });
    const state = _selector.store.getState();
    setAccounts(state.accounts);
    window.selectedWalletId = state.selectedWalletId! as WALLETID;
    window.selector = _selector;
    window.modal = _modal;
    window.account_id = _selector.isSignedIn()
      ? _selector.store.getState().accounts.find((account) => account.active)
          ?.accountId || null
      : null;
    window.wallet = _selector.isSignedIn() ? await _selector.wallet() : null;
    setSelector(_selector);
    setModal(_modal);
  }, []);

  useEffect(() => {
    init().catch((err) => {
      console.error(err);
      alert("Failed to initialise wallet selector");
    });
  }, [init]);

  useEffect(() => {
    if (!selector) {
      return;
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts);

        setAccounts(nextAccounts);

        window.account_id = nextAccounts.find(
          (account) => account.active
        )?.accountId!;
      });

    return () => subscription.unsubscribe();
  }, [selector]);

  if (!selector || !modal) {
    return null;
  }

  const accountId =
    accounts.find((account) => account.active)?.accountId || null;

  return (
    <WalletSelectorContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
      }}
    >
      {children}
    </WalletSelectorContext.Provider>
  );
};

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext);

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    );
  }

  return context;
}
