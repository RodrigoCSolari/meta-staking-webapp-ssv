import { Wallet, WalletSelector } from "@near-wallet-selector/core";
import {
  keyStores,
  connect,
  WalletConnection,
  providers,
  ConnectConfig,
} from "near-api-js";
import {
  getTransactionLastResult,
  JsonRpcProvider,
} from "near-api-js/lib/providers";
import { getConfig } from "../config";
import { TransactionStatusResult } from "../types/transactions.types";
import { tokenMethods } from "./methods";

import {
  decodeJsonRpcData,
  encodeJsonRpcData,
  getPanicError,
  getPanicErrorFromText,
  getTxFunctionCallMethod,
} from "./util";

export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;

export const META_CONTRACT_ID = process.env.NEXT_PUBLIC_META_CONTRACT_ID;

export const GAS = "200000000000000";
export const DEPOSIT = "1";
export const env = process.env.NEXT_PUBLIC_VERCEL_ENV || "testnet";
console.log("@env", env);

export const nearConfig = getConfig(env);
export const NETWORK_ID = nearConfig.networkId;
export const provider = new providers.JsonRpcProvider({
  url: nearConfig.nodeUrl,
});

export const getNearConfig = () => {
  return nearConfig;
};

export const callChangeMethod = async (
  wallet: Wallet,
  accountId: string,
  method: string,
  args: any,
  receiverId: string | undefined = undefined,
  deposit: string = ""
) => {
  // blockerStore.setState({isActive: true})
  const result = await wallet
    .signAndSendTransaction({
      signerId: accountId,
      receiverId: receiverId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args: args,
            gas: GAS,
            deposit: deposit,
          },
        },
      ],
    })
    .catch((err) => {
      console.log(
        `Failed to call contract -- method: ${method} - error message: ${err.message}`
      );
      throw getPanicErrorFromText(err.message);
    })
    .finally(() => {
      // blockerStore.setState({isActive: false})
    });
  if (result instanceof Object) {
    return result;
  }
  return null;
};

export const callViewMethod = async (
  method: string,
  args: any,
  contractId: string
) => {
  const response: any = await provider.query({
    request_type: "call_function",
    finality: "optimistic",
    account_id: contractId,
    method_name: method,
    args_base64: encodeJsonRpcData(args),
  });

  return decodeJsonRpcData(response.result);
};

export const getNearBalance = async (accountId: string): Promise<string> => {
  const body = `
          {
              "jsonrpc": "2.0",
              "id": "dontcare",
              "method": "query",
              "params": {
                  "request_type": "view_account",
                  "finality": "final",
                  "account_id": "${accountId}"
              }
          }`;

  const result = await fetch(getConfig(env).nodeUrl, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resultJson = await result.json();
  if (resultJson.error) {
    console.error(resultJson.error.data);
  }
  if (!resultJson.result) {
    return "0";
  }
  return resultJson.result.amount;
};

export const getMetadata = async (contractId: string) => {
  return callViewMethod(tokenMethods.getMetadata, {}, contractId);
};

export const addTokenToWallet = async (
  wallet: Wallet,
  accountId: string,
  contractId: string
) => {
  return callChangeMethod(
    wallet,
    accountId,
    tokenMethods.ftTransfer,
    { receiver_id: "---", amount: 0 },
    contractId,
    "0"
  );
};

export const queryChain = async (
  method: string,
  args: object
): Promise<any> => {
  const provider = new JsonRpcProvider(nearConfig.nodeUrl);
  return provider.sendJsonRpc(method, args);
};

export async function signOut(selector: WalletSelector) {
  const wallet = await selector.wallet();

  wallet.signOut().catch((err) => {
    console.log("Failed to sign out");
    console.error(err);
  });
}
