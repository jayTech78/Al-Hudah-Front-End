import fs from "fs";
import path from "path";
import Image from "next/image";
import {
    Grid,
    Box
} from "@chakra-ui/react";
import LandingPageNav from "@/Components/LandingPageNav";


export async function getStaticProps() {
    const galleryPath = path.join(process.cwd(), "public", "gallery");

    const images = fs
        .readdirSync(galleryPath)
        .filter((file) => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

    return {
        props: {
            images,
        },
    };
}

export default function Gallery({ images }) {
    return (
        <div>
            <LandingPageNav></LandingPageNav>
            <h1 className="text-center p-3 text-success">GALLERY</h1>
            <Grid
                templateColumns={{
                    base: "1fr",       // phones
                    sm: "repeat(2, 1fr)", // larger phones
                    md: "repeat(2, 1fr)", // tablets
                    lg: "repeat(4, 1fr)", // desktop
                }}
                gap={{ base: 3, md: 5, lg: 6 }}
                p={4}
            >
                {images.map((image) => (
                    <Box key={image} overflow="hidden" borderRadius="md">
                        <Image
                            src={`/gallery/${image}`}
                            alt={image}
                            width={300}
                            height={200}
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                            }}
                        />
                    </Box>
                ))}
            </Grid>

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
        </div>
    );
}