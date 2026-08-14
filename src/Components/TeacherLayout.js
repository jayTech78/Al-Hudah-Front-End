import { useDisclosure } from "@chakra-ui/react";
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import TeacherNavBar from "./TeacherNavBar";
import TeacherSideNav from "./TeacherSideNav";

export default function TeacherLayout({
  teacherId,
  className,
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      height="100vh"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* ================= NAVBAR ================= */}
      <Box flexShrink={0}>
        <TeacherNavBar />
      </Box>

      {/* ================= MOBILE HAMBURGER ================= */}
      <Box
        display={{ base: "block", lg: "none" }}
        p={2}
        flexShrink={0}
      >
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open menu"
          colorScheme="green"
        />
      </Box>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody p={0}>
            <TeacherSideNav
              teacherId={teacherId}
              className={className}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* ================= DESKTOP AREA ================= */}
      <Box
        flex="1"
        minHeight={0}
        display="flex"
        overflow="hidden"
      >

        {/* ================= SIDEBAR ================= */}
        <Box
          display={{ base: "none", lg: "block" }}
          width={{ lg: "250px", xl: "270px" }}
          flexShrink={0}
          bg="green.600"
          overflow="hidden"
        >
          <TeacherSideNav
            teacherId={teacherId}
            className={className}
          />
        </Box>

        {/* ================= MAIN CONTENT ================= */}
        <Box
          flex="1"
          minWidth={0}
          minHeight={0}
          overflowY="auto"
          overflowX="auto"
          bg="gray.50"
          p={{ base: 4, md: 6, lg: 8 }}
        >
          {children}
        </Box>

      </Box>
    </Box>
  );
}