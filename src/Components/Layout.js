import { VStack, Link,Flex,Box,Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Box as="header" bg="green.500" p={4}>
        <Text fontSize="xl" color="white">Teacher Dashboard</Text>
      </Box>
      <Flex flex="1" direction="row">
        <Box as="nav" bg="gray.100" width="200px" p={4}>
          <VStack spacing={4} align="stretch">
            <NextLink href="/dashboard" passHref>
              <Link>Home</Link>
            </NextLink>
            <NextLink href="/class-schedules" passHref>
              <Link>Class Schedules</Link>
            </NextLink>
            <NextLink href="/student-grades" passHref>
              <Link>Student Grades</Link>
            </NextLink>
            <NextLink href="/attendance" passHref>
              <Link>Attendance</Link>
            </NextLink>
            <NextLink href="/messages" passHref>
              <Link>Messages</Link>
            </NextLink>
          </VStack>
        </Box>
        <Box as="main" p={4} flex="1" bg="gray.50">
          {children}
        </Box>
      </Flex>
      <Box as="footer" bg="green.500" p={4} textAlign="center">
        <Text fontSize="sm" color="white">© 2024 School Name. All rights reserved.</Text>
      </Box>
    </Flex>
  );
};

export default Layout;
