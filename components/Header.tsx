import * as React from "react";
import { useEffect } from "react";
import {
  ButtonProps,
  Box,
  HStack,
  Container,
  Spacer,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { IconLink } from "./IconLink";
import { NavLink } from "./NavLink";
import { useAccount } from "wagmi";
import ButtonWallet from "./ButtonWallet";

const Header: React.FC<ButtonProps> = () => {
  const { isConnected } = useAccount();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected) {
      queryClient.removeQueries("ethereumBalance");
      queryClient.removeQueries("contractData");
    }
  }, [isConnected]);

  return (
    <Box as="section" pb={{ base: "2", md: "2" }}>
      <Box as="nav" alignContent="flex-end">
        <Container maxW="container.2xl" py={{ base: "3", lg: "4" }}>
          <HStack justify="space-between">
            <Box
              as="a"
              href="https://metapool.app/"
              target="_blank"
              overflow="hidden"
              h="30px"
              w="220px"
              minW="135px"
            >
              <Image
                height="90px"
                objectFit="cover"
                alt={"logo"}
                src={"./logo-meta-pool.svg"}
                my="-30px"
                mx="0px"
              />
            </Box>
            <Spacer></Spacer>
            {isDesktop && (
              <>
                <HStack
                  display={{ base: "none", md: "flex" }}
                  w="540px"
                  justifyContent="space-around"
                >
                  <NavLink href="/">Stake</NavLink>
                  <NavLink href="/unstake">Unstake</NavLink>
                  <NavLink href="/liquidity">Liquidity</NavLink>
                  <NavLink href="/faq">FAQ</NavLink>
                </HStack>
                <Spacer />
              </>
            )}
            <ButtonWallet />
            {isDesktop && (
              <Flex justifyContent="space-between" columnGap="5px">
                <IconLink
                  href="https://medium.com/@meta_pool"
                  src={"./medium-logo.svg"}
                  alt=""
                />
                <IconLink
                  href="https://discord.gg/tG4XJzRtdQ"
                  src={"./discord-logo.svg"}
                  alt=""
                />
                <IconLink
                  href="https://github.com/Narwallets/meta-pool"
                  src={"./github-logo.png"}
                  alt=""
                />
                <IconLink
                  href="https://twitter.com/meta_pool"
                  src={"./twitter-logo.svg"}
                  alt=""
                />
              </Flex>
            )}
            {!isDesktop && (
              <HStack spacing={10}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<HamburgerIcon h="22px" />}
                    variant="none"
                  />
                  <MenuList zIndex="3">
                    <MenuItem fontSize={"xl"} onClick={() => router.push("/")}>
                      Stake
                    </MenuItem>
                    <MenuItem
                      fontSize={"xl"}
                      onClick={() => router.push("/unstake")}
                    >
                      Unstake
                    </MenuItem>
                    <MenuItem
                      fontSize={"xl"}
                      onClick={() => router.push("/liquidity")}
                    >
                      Liquidity
                    </MenuItem>
                    <MenuItem
                      fontSize={"xl"}
                      onClick={() => router.push("/faq")}
                    >
                      FAQ
                    </MenuItem>
                    <Flex
                      p="6px 12px"
                      justifyContent="space-between"
                      cursor="default"
                    >
                      <IconLink
                        href="https://medium.com/@meta_pool"
                        src={"./medium-logo.svg"}
                        alt=""
                      />
                      <IconLink
                        href="https://discord.gg/tG4XJzRtdQ"
                        src={"./discord-logo.svg"}
                        alt=""
                      />
                      <IconLink
                        href="https://github.com/Narwallets/meta-pool"
                        src={"./github-logo.png"}
                        alt=""
                      />
                      <IconLink
                        href="https://twitter.com/meta_pool"
                        src={"./twitter-logo.svg"}
                        alt=""
                      />
                    </Flex>
                  </MenuList>
                </Menu>
              </HStack>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
