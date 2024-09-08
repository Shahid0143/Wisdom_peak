import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp, Send, X, Menu} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import img1 from "./assets/img-1.png";
import img2 from "./assets/img-2.png";
import hero from "./assets/hero1.png";
import img3 from "./assets/img-3.png";
import img4 from "./assets/img-4.png";
import html2pdf from "html2pdf.js";
import emailjs from "emailjs-com";


const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 18.6011, // Latitude for Wakad, Pune
  lng: 73.7641, // Longitude for Wakad, Pune
};

interface SectionRefs {
  [key: string]: React.RefObject<HTMLDivElement>;
}

interface VisibleSections {
  [key: string]: boolean;
}

interface Skills {
  [key: string]: number;
}

interface Timeline {
  [key: string]: boolean;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}



const projects: Project[] = [
  {
    id: 1,
    title: "Flixhub",
    description: "Discover a world of endless entertainment with FlixHub.",
    imageUrl: img1,
  },
  {
    id: 2,
    title: "Tele Phamacy",
    description:
      "TelePharmacy 24x7 is a digital healtcare platform, which provides online doctors consultation, online pharmacy and diagnostic tests at home.",
    imageUrl: img2,
  },
  {
    id: 3,
    title: "Trade Hub",
    description:
      "This web application allows users to sign up, log in, create a Demet account, stock analysis, maintain a portfolio, Read relevant Articles, Buy and sell stocks",
    imageUrl: img4,
  },
  {
    id: 4,
    title: "Daliy Object Clone",
    description:
      "A web application for a multi-national retail clothing chain. It specializes in fast fashion and sells clothing, accessories, shoes, beauty products, and perfumes.",
    imageUrl: img3,
  },
];

export default function AdvancedResume(): JSX.Element {
  const sectionRefs: SectionRefs = {
    profile: useRef<HTMLDivElement>(null),
    experience: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    skills: useRef<HTMLDivElement>(null),
    portfolio: useRef<HTMLDivElement>(null),
    hobbies: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
    references: useRef<HTMLDivElement>(null),
  };
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    hobbies: true,
    references: true,
  });
  const componentRef = useRef<HTMLDivElement>(null);

  const [skills, setSkills] = useState<Skills>({
    React: 90,
    "Next.js": 85,
    JavaScript: 95,
    TypeScript: 80,
    "HTML/CSS": 90,
  });

  const [timeline, setTimeline] = useState<Timeline>({
    "Jan 2020 - Present": false,
    "Jun 2017 - Dec 2019": false,
    "Sep 2013 - May 2017": false,
  });

  const [modalContent, setModalContent] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

   const toggleMenu = () => {
     setIsMenuOpen(!isMenuOpen);
   };

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
   const scrollToSection = (section: keyof SectionRefs) => {
     sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
     setIsMenuOpen(false); 
   };

  const toggleSection = (section: string): void => {
    setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

 const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
   e.preventDefault();
   if (validateForm()) {
     // Send email using EmailJS
      const templateParams: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };
     emailjs
       .send(
         "service_ivzpi7u", 
         "template_81iotbj", 
         templateParams,
         "VqUTXQTV0xMBqe2bo" 
       )
       .then(
         () => {
           toast({
             title: "Message Sent",
             description: "Your message has been sent successfully.",
           });
           setFormData({ name: "", email: "", message: "" }); 
         },
         (error) => {
           toast({
             title: "Message Failed",
             description: "There was an issue sending your message.",
           });
           console.error("EmailJS error:", error);
         }
       );
   }
 };
   const validateForm = (): boolean => {
     const errors: FormErrors = {};
     if (!formData.name.trim()) errors.name = "Name is required";
     if (!formData.email.trim()) errors.email = "Email is required";
     else if (!/\S+@\S+\.\S+/.test(formData.email))
       errors.email = "Email is invalid";
     if (!formData.message.trim()) errors.message = "Message is required";
     setFormErrors(errors);
     return Object.keys(errors).length === 0;
   };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const openModal = (content: string): void => {
    setModalContent(content);
  };

  const closeModal = (): void => {
    setModalContent(null);
  };

  const handleDownload = () => {
    const element = componentRef.current;

    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "download.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "in",
          format: [10, 11],
          orientation: "portrait",
        },
      })
      .save();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          } else {
            entry.target.classList.remove("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div ref={componentRef}>
        <nav className="sticky top-0 bg-white z-10 p-4 shadow-md">
          <div className="flex justify-between items-center">
            <div className="md:hidden">
              <button onClick={toggleMenu} aria-label="Toggle Menu">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          <ul
            className={`md:flex space-x-4 justify-center mt-4 md:mt-0 ${
              isMenuOpen ? "block" : "hidden"
            } md:block`}
          >
            {Object.keys(sectionRefs).map((section) => (
              <li key={section}>
                <Button
                  variant="ghost"
                  onClick={() => scrollToSection(section as keyof SectionRefs)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <Button
          onClick={handleDownload}
          className="fixed bottom-4 right-4 z-10"
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>

        {/* //Profile--section */}
        <TransitionGroup>
          <CSSTransition
            key="profile"
            timeout={500}
            classNames="fade"
            style={{ marginTop: "25px" }}
          >
            <Card ref={sectionRefs.profile}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Shahid Raza
                </CardTitle>
                <p className="text-gray-500">Frontend Developer</p>
                <p className="text-sm">ssraza143@mail.com | (+91) 9570810848</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-x-4 lg:flex-row">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={hero} alt="Shahid Raza" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold ">Profile</h2>
                  <p>
                    Motivated and innovative frontend developer proficient in
                    JavaScript and experienced with the MERN stack. Skilled in
                    designing and developing efficient server- side APIs using
                    Node.js and Express.js, as well as creating and optimizing
                    database models using MongoDB. Excellent problem-solving and
                    teamwork skills.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CSSTransition>

          {/* //Experience-section */}
          <CSSTransition
            key="experience"
            timeout={500}
            classNames="fade"
            style={{ marginTop: "25px" }}
          >
            <Card ref={sectionRefs.experience}>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {Object.entries(timeline).map(([period, isOpen]) => (
                    <li
                      key={period}
                      className="border-l-2 border-gray-200 pl-4 py-2"
                    >
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setTimeline((prev) => ({
                            ...prev,
                            [period]: !prev[period],
                          }))
                        }
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span>{period}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      {isOpen && (
                        <div className="mt-2">
                          {period === "Jan 2020 - Present" && (
                            <>
                              <h3 className="font-semibold">
                                Senior Frontend Developer - Tech Co.
                              </h3>
                              <p>
                                Led the development of the company's main
                                product, improving performance by 40%.
                              </p>
                              <Button
                                variant="link"
                                onClick={() =>
                                  openModal("Senior Frontend Developer")
                                }
                              >
                                View Details
                              </Button>
                            </>
                          )}
                          {period === "Jun 2017 - Dec 2019" && (
                            <>
                              <h3 className="font-semibold">
                                Frontend Developer - Web Solutions Inc.
                              </h3>
                              <p>
                                Developed and maintained multiple client
                                websites using React and Next.js.
                              </p>
                              <Button
                                variant="link"
                                onClick={() => openModal("Frontend Developer")}
                              >
                                View Details
                              </Button>
                            </>
                          )}
                          {period === "Sep 2013 - May 2017" && (
                            <>
                              <h3 className="font-semibold">
                                Computer Science Student - University of
                                Technology
                              </h3>
                              <p>
                                Completed Bachelor's degree with focus on web
                                technologies and software engineering.
                              </p>
                              <Button
                                variant="link"
                                onClick={() =>
                                  openModal("Computer Science Student")
                                }
                              >
                                View Details
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CSSTransition>

          {/* //Education-section */}
          <CSSTransition
            style={{ pageBreakBefore: "always", marginTop: "25px" }}
            key="education"
            timeout={500}
            classNames="fade"
          >
            <Card ref={sectionRefs.education}>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">
                  Bachelor of Science in Computer Science
                </h3>
                <p>University of Technology</p>
                <p className="text-sm text-gray-500">Graduated: May 2017</p>
              </CardContent>
            </Card>
          </CSSTransition>

          {/* //Skill-section */}
          <CSSTransition
            key="skills"
            timeout={500}
            classNames="fade"
            style={{ pageBreakInside: "avoid", marginTop: "25px" }}
          >
            <Card ref={sectionRefs.skills}>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(skills).map(([skill, level]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">{skill}</span>
                        <span>{level}%</span>
                      </div>
                      <Slider
                        value={[level]}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        onValueChange={([newValue]) =>
                          setSkills((prev) => ({ ...prev, [skill]: newValue }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CSSTransition>

          {/* //Portfolio--section */}
          <CSSTransition
            style={{ pageBreakInside: "avoid", marginTop: "25px" }}
            key="portfolio"
            timeout={500}
            classNames="fade"
          >
            <Card ref={sectionRefs.portfolio}>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-70 object-fill"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CSSTransition>

          {/* //Hobbies-section */}
          <CSSTransition
            key="hobbies"
            timeout={500}
            classNames="fade"
            style={{ marginTop: "25px", pageBreakInside: "avoid" }}
          >
            <Card ref={sectionRefs.hobbies}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Hobbies/Interests</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("hobbies")}
                >
                  {visibleSections.hobbies ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              {visibleSections.hobbies && (
                <CardContent>
                  <ul className="list-disc list-inside">
                    <li>Photography</li>
                    <li>Hiking</li>
                    <li>Reading tech blogs</li>
                    <li>Contributing to open-source projects</li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </CSSTransition>

          {/* //Reference--section */}
          <CSSTransition
            style={{ pageBreakInside: "avoid", marginTop: "25px" }}
            key="references"
            timeout={500}
            classNames="fade"
          >
            <Card ref={sectionRefs.references}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>References</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("references")}
                >
                  {visibleSections.references ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              {visibleSections.references && (
                <CardContent>
                  <ul className="space-y-4">
                    <li>
                      <h3 className="font-semibold">Jane Smith</h3>
                      <p className="text-sm text-gray-500">
                        Senior Manager, Tech Co.
                      </p>
                      <p>
                        "John is an exceptional developer with a keen eye for
                        detail and a passion for creating user-friendly
                        interfaces."
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold">Mike Johnson</h3>
                      <p className="text-sm text-gray-500">
                        CTO, Web Solutions Inc.
                      </p>
                      <p>
                        "Working with John was a pleasure. His technical skills
                        and ability to collaborate effectively made him an
                        invaluable team member."
                      </p>
                    </li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </CSSTransition>
        </TransitionGroup>

        {modalContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{modalContent}</h2>
                <Button variant="ghost" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p>
                {modalContent === "Senior Frontend Developer" &&
                  "As a Senior Frontend Developer at Tech Co., I led a team of 5 developers in creating a high-performance web application. Key achievements include improving load times by 40% and implementing a new design system that increased user engagement by 25%."}
                {modalContent === "Frontend Developer" &&
                  "At Web Solutions Inc., I was responsible for developing and maintaining client websites using React and Next.js. I collaborated with designers and backend developers to deliver responsive and accessible web applications, resulting in a 30% increase in client satisfaction."}
                {modalContent === "Computer Science Student" &&
                  "During my time at the University of Technology, I focused on web technologies and software engineering. I completed several projects, including a full-stack social media application, and participated in coding competitions, placing in the top 10% nationally."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        {/* //contact--section */}
        <CSSTransition key="contact" timeout={500} classNames="fade mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Contact Me</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={formErrors.message ? "border-red-500" : ""}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </CSSTransition>

        {/* //google-map */}
        <Card className=" mt-8">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadScript googleMapsApiKey="AIzaSyBCNfkjYCdAEZG88ynaeoAL_yEks9Ll3Go">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={10}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
