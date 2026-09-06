import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import LandingPageNav from "@/Components/LandingPageNav";
import Logo from '../../public/sms _image6.jpg'
import style from '@/styles/background.module.css'

const faqs = [
  {
    value: "faq1",
    title: "What curriculum does Al-Hudah International Group of Schools follow?",
    text: "We follow a balanced curriculum that integrates Islamic teachings with national and international academic standards.",
  },
  {
    value: "faq2",
    title: "What are the admission requirements?",
    text: "Admission requirements vary by grade level. Generally, students need to pass an entrance exam and submit necessary documents like birth certificates and previous academic records.",
  },
  {
    value: "faq3",
    title: "Do you offer Islamic studies along with regular subjects?",
    text: "Yes, we integrate Islamic studies, Quranic recitation, and Arabic language alongside core academic subjects.",
  },
];

export default function LandingPage() {
  return (
    <Box>
      <LandingPageNav />

      <div className="container">
        <div className="row">
          <div className="col-md-12 col-12 col-lg-6">
            <div className="p-1 d-flex justify-content-center fst-italic">
              <div className="my-5">
                <div className="display-6 my-3">Welcome To Al-Hudah Schools Limited</div>
                <div className="">
                  A Center of Excellence in Islamic and Academic Education. <br />
                  <br />
                  At Al-Hudah Schools Limited, we are committed to nurturing young minds with the light of knowledge and the spirit of faith.
                  Our mission is to empower students with a balanced education that integrates Islamic values with academic excellence, preparing them to thrive in the modern world while remaining grounded in their faith. <br />
                  <br />
                  Our dedicated team of educators foster a safe, respectful, and inspiring environment where students can grow spiritually, intellectually, and socially. Through a holistic approach to learning, we aim to cultivate future leaders who embody the principles of Islam—compassion, integrity, and wisdom. <br />
                  <br />
                  We warmly invite you to explore our school and discover how we can help shape your child’s future, insha’Allah.<br></br>

                  <p className="fw-bold block my-3 p-3 pt-3">~ Proprietor</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-12 col-lg-6 p-1 mb-4 my-5">
            <Image src={Logo} width={1050} height={80} alt="School Logo" className="img-fluid" />
          </div>
        </div>
      </div>

      <section id="Ourpurpose">
        <div className="bg-success">
          <div className="container my-5">
            <div className="p-3 my-5">
              <div className="row my-5">
                <div className="p-1 col-lg-4 col-12">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <div className="py-5 border-top border-dark ">
                      <h3 className="text-center">Our Mission</h3>
                      <p className="text-center m-3">
                        Al-hudah Group Of Schools is dedicated to providing a holistic
                        educational experience that fosters the intellectual, spiritual,
                        and social growth of our students. We aim to develop individuals
                        who are committed to excellence, guided by Islamic principles,
                        and prepared to contribute positively to society.
                      </p>
                    </div>

                  </div>
                </div>
                <div className="p-1 col-lg-4 col-12">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <div className="py-5 mb-6 border-top border-dark ">
                      <h3 className="text-center">Our Vision</h3>
                      <p className="text-center my-3">
                        To be a leading educational institution known for its commitment
                        to academic excellence, Islamic values, and community engagement.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-1 col-lg-4 col-12">
                  <div className="p-3 border rounded-3 bg-light h-100">
                    <div className="py-5 mb-1 border-top border-dark ">
                      <h3 className="text-center">Our Curriculum</h3>
                      <p className="text-center my-3 align-items-center">
                        Our curriculum is designed to provide a well-rounded education that integrates Islamic studies with core subjects such as Mathematics, Science, Language Arts, and Social Studies. In addition to academic subjects, students participate in Quranic studies, Islamic studies, Arabic language, and enrichment programs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-light my-5 p-3 px-5">Learn More</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <div className={style.accordion}>
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="my-5 p-5 col-10">
              <h2 className="text-center p-3 ">Frequently Asked Questions</h2>
              <div className="p-2 mb-5">
                <Accordion allowToggle>
                  {faqs.map((item, idx) => (
                    <AccordionItem key={idx}>
                      <h2 className="text-center">
                        <AccordionButton _expanded={{ bg: "teal.500", color: "white" }}>
                          <Box flex="1" textAlign="left" fontWeight="bold">{item.title}</Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>{item.text}</AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* Testimonial */}
      <section>
        <div className="bg-white">
          <div className="container">
            <div className="p-3 my-5">
              <h2 className="text-center">Testimonial</h2>
              <div className="row d-flex justify-content-center text-white">
                <div className="col-lg-3 col-12 col-md-6 p-2">
                <div className="border rounded-3 border-dark bg-success p-3 h-100">
                  <div className="p-3">
                    <div className="mb-3 border-bottom">
                    Lawal Jafar
                    </div>
                    <p className="p-4 ">
                  "<br></br>
                   The College has taught me to take responsibilities that I never thought I would ever take. One thing I love about Alhudah is 
                  "
                    </p>
                  </div>
                </div>
                </div>
                <div className="col-lg-3 col-12 col-md-6 p-2">
                <div className="border rounded-3 border-dark bg-success p-3 h-100">
                  <div className="p-3 h-5">
                    <div className="mb-3 border-bottom">
                    Okikiade Hussein
                    </div>
                    <p className="p-3">
                  "
                   Being in Alhudah has been an amazing experience. Its not just about the moral and academic impacts on the colleg, but also about its reconstruction
                   of my thinking and mylifestyle
                  "
                    </p>
                  </div>
                </div>
                </div>
                <div className="col-lg-3 col-12 col-md-6 p-2">
                <div className="border rounded-3 border-dark bg-success p-3 h-100">
                  <div className="p-3 h-5">
                    <div className="mb-3 border-bottom">
                    Kehinde Fadlullah
                    </div>
                    <p className="p-3">
                  "<br></br>
                   Being in Alhudah has been an amazing experience. Its not just about the moral and academic impacts on the colleg, but also about its reconstruction
                   of my thinking and mylifestyle
                  "
                    </p>
                  </div>
                </div>
                </div>
                <div className="col-lg-3 col-12 col-md-6 p-2 h-100">
                <div className="border rounded-3 border-dark bg-success p-3">
                  <div className="p-3">
                    <div className="mb-3 border-bottom">
                    Junaid Hanif
                    </div>
                    <p className="p-3">
                  "<br></br>
                   Being in Alhudah has been an amazing experience. Its not just about the moral and academic impacts on the colleg, but also about its reconstruction
                   of my thinking and mylifestyle
                  "
                    </p>
                  </div>

                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section id="Footer">
        <div className="bg-success text-white">
          <div className="container">
            <div className="row p-5">
              <div className="col-12 col-md-6 col-lg-4 p-3">
                <div className="">
                  <div className="fw-bold mb-3">
                    Contacts
                  </div>
                  <div className="mb-3">
                    Email: alhudahschools@gmail.com
                  </div>
                  <div className="mb-3">
                    Phone No: 08036663636, 08033809331
                  </div>
                  <div className="mb-3">
                    Address: Plot 7-9, Al-Hudah Street, Labaiwa Village, Itoko Titun,Oke- Aregba, Abeokuta, Ogun-State.
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 col-lg-4 p-3">
                <div className="fw-bold mb-2">
                  Quick Links
                </div>
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
                  A committed to nurturing young minds with the light of knowledge and the spirit of faith, and dedicated to providing a holistic educational experience that fosters the intellectual, spiritual, and social growth of our students.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Box>
  );
}
