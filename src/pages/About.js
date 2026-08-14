import Image from "next/image";
import { Box, Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import logo from "../logo-removebg-preview.png"; // Ensure this path is correct
import LandingPageNav from "../Components/LandingPageNav";
export default function About() {
  return (
    <>
      <div className={inter.className}>
        <LandingPageNav></LandingPageNav>
        <Text className="bg-white py-5 d-flex justify-content-center ">
          <div className="fs-1">About Us </div>
        </Text>
        <hr />
        <Box className="d-flex row">
          <div className="col-6">
            <Box
              px={8}
              py={12}
              bg="gray.90"
              className="bg-light d-flex justify-content-center"
            >
              <Box className="col-9">
                  
                  <div className="d-block">
                    <p>
                      At Al-hudah Group Of Schools, we believe in nurturing young
                      minds and hearts with the values of Islam while providing
                      a high-quality education. Here’s a glimpse into who we are
                      and what makes us unique: <br></br>
                    </p>
                    <br></br>
                    <p>
                      <strong>Our Mission:</strong> Al-hudah Group Of Schools is
                      dedicated to providing a holistic educational experience
                      that fosters the intellectual, spiritual, and social
                      growth of our students. We aim to develop individuals who
                      are committed to excellence, guided by Islamic principles,
                      and prepared to contribute positively to society.
                    </p>
                    <br></br>
                    <p>
                      <strong>Our Vision:</strong> To be a leading educational
                      institution known for its commitment to academic
                      excellence, Islamic values, and community engagement.
                    </p>
                    <br></br>
                    <p className="ms-0 mb-3">
                      <strong>Our Values:</strong>
                      <ol>
                        <li>
                          <p>
                            Islamic Identity: We strive to instill a strong
                            sense of Islamic identity in our students, rooted in
                            faith, knowledge, and good character.
                          </p>
                        </li>
                        <li>
                          <p>
                            Academic Excellence: We are committed to providing a
                            rigorous academic program that challenges and
                            inspires our students to reach their full potential.
                          </p>
                        </li>
                        <li>
                          <p>Character Development: We emphasize the importance of character development, encouraging traits such as compassion, integrity, and resilience.</p>
                        </li>
                        <li>
                          <p>Community Engagement: We actively engage with our local and global communities, fostering a spirit of service and social responsibility among our students.</p>
                        </li>
                        <li>
                          <p>Innovation and Creativity: We embrace innovation and creativity in teaching and learning, preparing our students to adapt to an ever-changing world.</p>
                        </li>
                      </ol>
                    </p>
                   <p>
                   <strong>Our Curriculum:</strong> Our curriculum is designed to provide a well-rounded education that integrates Islamic studies with core subjects such as Mathematics, Science, Language Arts, and Social Studies. In addition to academic subjects, students participate in Quranic studies, Islamic studies, Arabic language, and enrichment programs.
                   </p>
                   <p>
                   <strong>Our Faculty:</strong> Our dedicated team of educators is passionate about teaching and committed to the success of every student. Our teachers are experienced, highly qualified, and undergo continuous professional development to ensure the highest standards of instruction.
                   </p>
                   <p>
                   <strong>Our Facilities:</strong> Al-Hudah Group Of Schools provides modern facilities conducive to learning and growth. Our campus includes well-equipped classrooms, a library, science and computer labs, a multipurpose hall, and outdoor recreational areas.
                   </p>
                   <p>
                    <strong>Admissions:</strong> We welcome students of all backgrounds who are eager to learn and grow in a supportive Islamic environment. Admissions are open to students from preschool through high school. To learn more about our admissions process and to schedule a tour of our school, please visit our Admissions page.
                   </p>
                   <p>
                    <strong>Get Involved:</strong> Parents, alumni, and community members play a vital role in the success of our school. Whether through volunteering, donating, or attending school events, there are many ways to get involved and support our mission.
                   </p>
                   <p>
                   <strong>Contact Us:</strong> We invite you to reach out to us with any questions or inquiries. Our friendly staff is here to assist you. Visit our Contact Us page for more information.
                   </p>
                   Thank you for considering A-Hudah Group Of Schools for your child’s education. Together, let’s inspire excellence and cultivate future leaders grounded in faith and knowledge.
                  </div>
                <Text
                  textAlign="center"
                  fontSize="md"
                  className="col-10 ms-5"
                ></Text>
              </Box>
            </Box>
          </div>
          <div className="col-6 bg-light">
            <Box className="d-flex justify-content-center">
              <h1>
                AL-HUDAH GROUP OF SCHOOLS
              <hr />
              </h1>
              <br></br>
            </Box>
            <Box
              px={8}
              py={12}
              bg="gray.90"
              className="d-flex justify-content-center"
            >
              <Image
                src={logo}
                width={600}
                height={400}
                className="ms-0"
                alt=""
              />
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
}
