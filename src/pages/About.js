import Image from "next/image";
import { Box, Heading, Text, Button, VStack, Flex } from "@chakra-ui/react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import logo from "../logo-removebg-preview.png"; // Ensure this path is correct
import LandingPageNav from "../Components/LandingPageNav";
export default function About() {
  return (
    <>
      <div
        className={inter.className}
        style={{ overflow: "hidden", width: "100%" }}
      >
        <LandingPageNav></LandingPageNav>
        <Text className="bg-white py-5 d-flex justify-content-center ">
          <div className="fs-1 text-success">ABOUT US </div>
        </Text>
        <hr />

        <Box className="d-flex row">
          {/* SECOND SECTION — appears FIRST on tablet/phone */}
          <div className="col-12 col-lg-6 order-1 order-lg-2 bg-light">
            <Box className="d-flex justify-content-center">
              <h1 className="text-center">
                AL-HUDAH GROUP OF SCHOOLS
                <hr />
              </h1>
            </Box>

            <Box
              px={{ base: 3, md: 5, lg: 8 }}
              py={{ base: 5, md: 8, lg: 12 }}
              className="d-flex justify-content-center"
            >
              <Image
                src={logo}
                width={600}
                height={400}
                className="img-fluid"
                alt="Al-Hudah Group of Schools"
              />
            </Box>
          </div>

          {/* FIRST SECTION — appears SECOND on tablet/phone */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <Box
              px={{ base: 4, md: 6, lg: 8 }}
              py={{ base: 6, md: 8, lg: 12 }}
              bg="gray.90"
              className="bg-light d-flex justify-content-center"
            >
              <Box className="col-12 col-lg-9">
                <div className="d-block">
                  <p>
                    At Al-hudah Group Of Schools, we believe in nurturing young
                    minds and hearts with the values of Islam while providing a
                    high-quality education. Here’s a glimpse into who we are and
                    what makes us unique: <br></br>
                  </p>
                  <br></br>
                  <p>
                    <strong>Our Mission:</strong> Al-hudah Group Of Schools is
                    dedicated to providing a holistic educational experience
                    that fosters the intellectual, spiritual, and social growth
                    of our students. We aim to develop individuals who are
                    committed to excellence, guided by Islamic principles, and
                    prepared to contribute positively to society.
                  </p>
                  <br></br>
                  <p>
                    <strong>Our Vision:</strong> To be a leading educational
                    institution known for its commitment to academic excellence,
                    Islamic values, and community engagement.
                  </p>
                  <br></br>
                  <p className="ms-0 mb-3">
                    <strong>Our Core Values:</strong>
                    <ol>
                      <li>
                        <p>
                          Islamic Identity: We strive to instill a strong sense
                          of Islamic identity in our students, rooted in faith,
                          knowledge, and good character.
                        </p>
                      </li>
                      <li>
                        <p>
                          Academic Excellence: We are committed to providing a
                          rigorous academic program that challenges and inspires
                          our students to reach their full potential.
                        </p>
                      </li>
                      <li>
                        <p>
                          Character Development: We emphasize the importance of
                          character development, encouraging traits such as
                          compassion, integrity, and resilience.
                        </p>
                      </li>
                      <li>
                        <p>
                          Community Engagement: We actively engage with our
                          local and global communities, fostering a spirit of
                          service and social responsibility among our students.
                        </p>
                      </li>
                      <li>
                        <p>
                          Innovation and Creativity: We embrace innovation and
                          creativity in teaching and learning, preparing our
                          students to adapt to an ever-changing world.
                        </p>
                      </li>
                    </ol>
                  </p>
                  <p>
                    <strong>Our Curriculum:</strong> Our curriculum is designed
                    to provide a well-rounded education that integrates Islamic
                    scholarship with core subjects such as Mathematics, Science,
                    Language Arts and Social Sciences. In addition to academic
                    subjects, students participate in Quranic studies, Islamic
                    studies, Arabic language, and enrichment programs.
                  </p>
                  <p>
                    <strong>Our Faculty:</strong> Our dedicated team of
                    educators are passionate about teaching and committed to the
                    success of every student. Our teachers are experienced,
                    highly qualified, and undergo continuous professional
                    development to ensure the highest standards of instruction.
                  </p>
                  <p>
                    <strong>Our Facilities:</strong> Al-Hudah Group Of Schools
                    provides modern facilities conducive to learning and growth.
                    Our campus includes well-equipped classrooms, a library,
                    science and computer labs, a multipurpose hall, and outdoor
                    recreational areas.
                  </p>
                  <p>
                    <strong>Admissions:</strong> We welcome students of all
                    backgrounds who are eager to learn and grow in a supportive
                    Islamic environment. Admissions are open to students from
                    preschool through high school. To learn more about our
                    admissions process and to schedule a tour of our school,
                    please visit our Admissions page.
                  </p>
                  <p>
                    <strong>Physical Fitness:</strong> Physical fitness is an
                    essential part of a student's overall health, growth, and
                    development. At Al-hudah Schools Limited, we encourage students to
                    participate actively in physical activities that promote
                    strength, endurance, flexibility, coordination, and a
                    healthy lifestyle. Through regular exercise, sports, games,
                    and other fitness activities, students develop not only
                    physical strength but also important values such as
                    teamwork, discipline, confidence, perseverance, and
                    sportsmanship. We believe that a healthy body supports a
                    healthy mind. Our physical fitness programmes are designed
                    to help students stay active, reduce stress, build positive
                    habits, and maintain a balanced lifestyle. We encourage
                    every student to take part in physical activities and
                    develop a lifelong appreciation for health and fitness.
                  </p>
                  <p>
                    <strong>Get Involved:</strong> Parents, alumni, and
                    community members play a vital role in the success of our
                    school. Whether through volunteering, donating, or attending
                    school events, there are many ways to get involved and
                    support our mission.
                  </p>
                  <p>
                    <strong>Contact Us:</strong> We invite you to reach out to
                    us with any questions or inquiries. Our friendly staff is
                    here to assist you. Visit our Contact Us page for more
                    information.
                  </p>
                  Thank you for considering A-Hudah Group Of Schools for your
                  child’s education. Together, let’s inspire excellence and
                  cultivate future leaders grounded in faith and knowledge.
                </div>
              </Box>
            </Box>
          </div>
        </Box>

        <section id="Footer">
          <div className="bg-success text-white">
            <div className="container">
              <div className="row p-5">
                <div className="col-12 col-md-6 col-lg-4 p-3">
                  <div className="">
                    <div className="fw-bold mb-3">Contacts</div>
                    <div className="mb-3">Email: alhudahschools@gmail.com</div>
                    <div className="mb-3">
                      Phone No: 08036663636, 08033809331
                    </div>
                    <div className="mb-3">
                      Address: Plot 7-9, Al-Hudah Street, Labaiwa Village, Itoko
                      Titun,Oke- Aregba, Abeokuta, Ogun-State.
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-3">
                  <div className="fw-bold mb-2">Quick Links</div>
                  <div className="mb-2">
                    <a href="/">Home</a>
                  </div>
                  <div className="mb-2">
                    <a href="/About">About</a>
                  </div>
                  <div className="mb-2">
                    <a href="/Contacts">Contacts</a>
                  </div>
                  <div className="mb-2">
                    <a href="/Login">Login</a>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-lg-4 p-3 border-start">
                  <div className="fw-bold mb-2 p-2">
                    Al-Hudah Group Of Schools
                  </div>
                  <div>
                    A committed to nurturing young minds with the light of
                    knowledge and the spirit of faith, and dedicated to
                    providing a holistic educational experience that fosters the
                    intellectual, spiritual, and social growth of our students.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
