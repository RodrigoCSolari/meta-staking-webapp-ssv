import { Link } from "@chakra-ui/react";
import React from "react";
import { getConfig } from "../config";

type Props = {
  hash: string;
};

export const DetailsLink = ({ hash }: Props) => {
  const explorerUrl = getConfig().explorerUrl;
  return (
    <Link
      target="_blank"
      fontSize=".8em"
      href={`${explorerUrl}/tx/${hash}`}
      textDecoration="underline"
      color="#fffb"
    >
      See Transaction Details
    </Link>
  );
};
