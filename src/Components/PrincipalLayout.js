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
    {
      href: "/dashboard",
      label: "Dashboard Overview",
    },
    {
      href: "/Applications",
      label: "Applications",
    },
    {
      href: "/PGetStudents",
      label: "Student Management",
    },
    {
      href: "/PSession",
      label: "Session/Term",
    },
    {
      href: "/PClasses",
      label: "Class Management",
    },
    {
      href: "/PGetSubjects",
      label: "Subject Management",
    },
    {
      href: "/PAttendance",
      label: "Attendance Management",
    },
    {
      href: "/PGrading",
      label: "Grade Management",
    },
    {
      href: "/PGenerateBill",
      label: "Generate Bill",
    },
  ];

  // Sidebar content
  const SidebarContent = () => (
    <Box
      bg="gray.100"
      width="100%"
      height="100%"
      p={4}
      overflow="hidden"
    >
      <VStack
        spacing={2}
        align="stretch"
      >
        {linkItems.map((item) => (
          <NextLink
            href={item.href}
            passHref
            legacyBehavior
            key={item.href}
          >
            <ChakraLink
              bg={
                router.pathname === item.href
                  ? "teal.100"
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
                bg: "teal.50",
              }}
            >
              {item.label}
            </ChakraLink>
          </NextLink>
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
        bg="teal.500"
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
            colorScheme="teal"
            bg="white"
            color="teal.500"
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
            Principal
          </Text>

        </Flex>

        <Button
          size="sm"
          variant="outline"
          color="white"
          borderColor="white"
          _hover={{
            bg: "white",
            color: "teal.500",
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
