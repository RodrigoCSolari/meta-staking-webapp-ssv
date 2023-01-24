import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import { getConfig } from "../config";
import React from "react";
import { env } from "../lib/near";

type Props = {
  hash: string;
};

const HashDetailLink = ({ hash }: Props) => {
  return (
    <Link
      target="_blank"
      fontSize=".8em"
      href={`${getConfig(env).explorerUrl}/transactions/${hash}`}
      textDecoration="underline"
      color="#fffb"
      isExternal
    >
      See Transaction Details <ExternalLinkIcon mx="2px" />
    </Link>
  );
};

export default HashDetailLink;
