import { useEffect } from "react";
import ParentNavBar from "./ParentNavBar";
import ParentSideNav from "./ParentSideNav";
import { HamburgerIcon } from "@chakra-ui/icons"
import {
    Box,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";


export default function ParentLayout({
    children,
    parentId,
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
        <div className="no-print">
            {/* Top Navbar */}
            <ParentNavBar />
        </div>
            <Box display={{ base: "block", lg: "none" }} p={2}>
                <IconButton
                    icon={<HamburgerIcon />}
                    onClick={onOpen}
                    aria-label="Menu"
                    colorScheme="green"
                />
            </Box>

            {/* Main Layout */}
            <div className="container-fluid p-0">
                <div className="row g-0">

                    {/* Sidebar */}
                    <Drawer
                        isOpen={isOpen}
                        placement="left"
                        onClose={onClose}
                    >

                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerBody p={0}>
                                <ParentSideNav parent_Id={parentId} />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                    <div
                        className="col-lg-2 d-none d-lg-block bg-success p-0 no-print"
                        style={{ minHeight: "calc(100vh - 70px)" }}
                    >
                        <ParentSideNav parent_Id={parentId} />
                    </div>

                    {/* Main Content */}
                    <div
                        className="col-lg-10 p-4 col-12 print-layout-content"
                        style={{
                            overflowY: "auto",
                            height: "calc(100vh - 70px)"
                        }}
                    >
                        {children}
                    </div>
                    <style jsx global>{`
  @media print {
    .print-layout-content {
      overflow: visible !important;
      height: auto !important;
      width: 100% !important;
      padding: 0 !important;
    }
  }
     @media print {
    .no-print {
      display: none !important;
    }
  }
`}</style>
                </div>
            </div>

        </>
    );
}