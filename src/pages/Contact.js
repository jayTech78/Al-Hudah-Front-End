 import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import Image from "next/image";
import LandingPageNav from "../Components/LandingPageNav";

export default function About() {
  return (
    <>
      <LandingPageNav />
      <Text bg="white" py={5} textAlign="center" fontSize="2xl" fontWeight="bold">
        Contact
      </Text>
      <Box p={5} textColor="white">
        <Flex wrap="wrap" justify="center" gap={6}>
          <Box bg="green.500" p={5} borderRadius="lg" w="250px">
            <Heading size="md">Address</Heading>
            <Text mt={2}>
              Plot 7/9, Al-Hudah Street, Labaiwa Village, Itoko-Titun, Oke-Aregba, Abeokuta, Ogun State
            </Text>
          </Box>
          <Box bg="green.500" p={5} borderRadius="lg" w="250px">
            <Heading size="md">Facebook</Heading>
            <Text mt={2}>Al-Hudah Group Of Schools</Text>
          </Box>
          <Box bg="green.500" p={5} borderRadius="lg" w="250px">
            <Heading size="md">Phone No</Heading>
            <Text mt={2}>
              08033809331 <br /> 08033663636
            </Text>
          </Box>
          <Box bg="green.500" p={5} borderRadius="lg" w="250px">
            <Heading size="md">Email</Heading>
            <Text mt={2}>al-hudah@gmail.com</Text>
          </Box>
        </Flex>
      </Box>

      {/* Logo Display */}
      <Flex justify="center" mt={8}>
        <Image src="/logo-removebg-preview.png" width={200} height={150} alt="School Logo" />
      </Flex>
    </>
  );
}
