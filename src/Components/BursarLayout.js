import {
  VStack,
  Link as ChakraLink,
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();

  const {
    isOpen,
    onOpen,
    onClose,
  } = useDisclosure();

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    router.push("/StaffLogin");
  };

  const linkItems = [
    { href: '/GetBooks', label: 'Books/Fees', },
    { href: '/Payments', label: 'Payment', },
    { href: '/Audit', label: 'Audit', },
    { href: '/Finances', label: 'Finances', },
    { href: '/Incomes', label: 'Incomes',},
    { href: '/Expenses', label: 'Expenses',},
    { href: '/Cashbook', label: 'Cashbook',}
  ];

  // Sidebar content
  const SidebarContent = () => (
  <Box
    bg="gray.100"
    width="100%"
    height="100%"
    p={2}
    overflow="hidden"
  >
    <VStack
      spacing={2}
      align="stretch"
    >
      {linkItems.map((item) => (
        <ChakraLink
          as={NextLink}
          href={item.href}
          key={item.href}
          bg={
            router.pathname === item.href
              ? "green.100"
              : "transparent"
          }
          p={3}
          borderRadius="md"
          fontWeight={
            router.pathname === item.href
              ? "bold"
              : "normal"
          }
          _hover={{
            textDecoration: "none",
            bg: "green.50",
          }}
        >
          {item.label}
        </ChakraLink>
      ))}
    </VStack>
  </Box>
);

  return (
    <Flex
      direction="column"
      height="100vh"
      overflow="hidden"
    >

      {/* ================= HEADER ================= */}

      <Flex
        as="header"
        bg="green.500"
        p={4}
        justify="space-between"
        align="center"
        flexShrink={0}
      >
        <Flex align="center" gap={3}>

          {/* Hamburger - PHONE + TABLET ONLY */}
          <IconButton
            display={{
              base: "flex",
              lg: "none",
            }}
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open navigation"
            colorScheme="green"
            bg="white"
            color="green.500"
            _hover={{
              bg: "gray.100",
            }}
          />

          <Text
            fontSize={{
              base: "lg",
              md: "xl",
            }}
            color="white"
          >
            Bursar
          </Text>

        </Flex>

        <Button
          size="sm"
          variant="outline"
          color="white"
          borderColor="white"
          _hover={{
            bg: "white",
            color: "green.500",
          }}
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Flex>


      {/* ================= MOBILE / TABLET DRAWER ================= */}

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>


      {/* ================= DESKTOP + MAIN CONTENT ================= */}

      <Flex
        flex="1"
        minHeight="0"
        overflow="hidden"
      >

        {/* DESKTOP SIDEBAR */}

        <Box
          display={{
            base: "none",
            lg: "block",
          }}
          width="250px"
          flexShrink={0}
          height="100%"
          bg="gray.100"
          overflow="hidden"
        >
          <SidebarContent />
        </Box>


        {/* MAIN CONTENT */}

        <Box
          as="main"
          flex="1"
          minWidth="0"
          minHeight="0"
          p={{
            base: 3,
            md: 4,
            lg: 6,
          }}
          bg="gray.50"

          /*
           * IMPORTANT:
           * Only this area scrolls.
           */
          overflowY="auto"
          overflowX="auto"
        >
          {children}
        </Box>

      </Flex>

    </Flex>
  );
};

export default Layout;
