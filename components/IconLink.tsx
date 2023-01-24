import { Img, Link } from "@chakra-ui/react";
import React from "react";

type Props = {
  alt?: string;
  href: string;
  src: string;
};

export const IconLink = ({ alt, href, src }: Props) => {
  return (
    <Link
      href={href}
      target="_blank"
      _active={{
        textDecoration: "none",
        boxShadow: "0 0 0 0 #0000",
      }}
      _focus={{
        textDecoration: "none",
        boxShadow: "0 0 0 0 #0000",
      }}
      minW="20px"
    >
      <Img src={src} alt={alt ?? ""} width="20px" height="20px" />
    </Link>
  );
};
