import Layout from "@/Components/PrincipalLayout";
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [data, setData] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    // Simulate fetching data from API or backend
    const fetchData = async () => {
      // Replace with your actual API calls
      const dashboardData = {
        totalClasses: 5,
        totalStudents: 120,
        totalTeachers: 20,
        totalApplications: 20,
      };
      setData(dashboardData);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Text fontSize="2xl" mb={6}>Welcome to Your Dashboard</Text>
      <SimpleGrid columns={[1, null, 3]} spacing={6}>
        <Box p={5} shadow="md" borderWidth="1px" bg="white">
          <Stat>
            <StatLabel>Total Classes</StatLabel>
            <StatNumber>{data.totalClasses}</StatNumber>
          </Stat>
        </Box>
        <Box p={5} shadow="md" borderWidth="1px" bg="white">
          <Stat>
            <StatLabel>Total Students</StatLabel>
            <StatNumber>{data.totalStudents}</StatNumber>
          </Stat>
        </Box>
        <Box p={5} shadow="md" borderWidth="1px" bg="white">
          <Stat>
            <StatLabel>Total Teachers</StatLabel>
            <StatNumber>{data.totalTeachers}</StatNumber>
          </Stat>
        </Box>
        <Box p={5} shadow="md" borderWidth="1px" bg="white">
          <Stat>
            <StatLabel>Total Applications</StatLabel>
            <StatNumber>{data.totalApplications}</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>
    </Layout>
  );
};

export default Dashboard;
