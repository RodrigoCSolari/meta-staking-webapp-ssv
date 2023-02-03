import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/react";
import React from "react";

type Props = {
  hash: string;
};

const HashDetailLink = ({ hash }: Props) => {
  return (
    <Link
      target="_blank"
      fontSize=".8em"
      href={`${hash}`}
      textDecoration="underline"
      color="#fffb"
      isExternal
    >
      See Transaction Details <ExternalLinkIcon mx="2px" />
    </Link>
  );
};

export default HashDetailLink;
