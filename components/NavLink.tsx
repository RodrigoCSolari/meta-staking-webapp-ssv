import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
  href: string;
  children?: ReactNode;
};

export const NavLink = ({ href, children }: Props) => {
  const router = useRouter();
  return (
    <Link href={href}>
      <Text
        cursor="pointer"
        color={router.pathname === href ? "purple.500" : "inherit"}
      >
        {children}
      </Text>
    </Link>
  );
};
