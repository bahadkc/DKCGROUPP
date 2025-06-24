import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetails from './components/ProjectDetails';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: #1a1a1a;
  }
`;

const AboutPage = styled.div`
  min-height: 100vh;
  padding: 6rem 2rem;
  background: #1a1a1a;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
    min-height: calc(100vh - 4rem);
  }
`;

const AboutContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const AboutText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  opacity: 0.8;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const ContactSection = styled.div`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    margin-top: 3rem;
    padding-top: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
`;

const ContactTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 3rem;
  font-weight: 300;
  letter-spacing: 2px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 3rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 2rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-top: 1rem;
  }
`;

const ContactItem = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ContactIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const ContactType = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  opacity: 0.6;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const ContactInfo = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const ContactName = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 0.3rem;
  }
`;

const ContactRole = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 1rem;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
`;

const ContactValue = styled.div`
  font-weight: 400;
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const AddressCard = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    padding: 1rem;
  }
`;

const AddressInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    order: 2;
    text-align: center;
  }
`;

const AddressImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    order: 1;
    
    img {
      height: 150px;
    }
  }
  
  @media (max-width: 480px) {
    img {
      height: 120px;
    }
  }
`;

const AddressIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const AddressType = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  opacity: 0.6;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
`;

const AddressText = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 400;
  
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

// Project data
const projects = [
  {
    id: 1,
    title: "Nova Loft",
    category: "Residential",
    image: process.env.PUBLIC_URL + "/imagess/nova3.PNG"
  },
  {
    id: 2,
    title: "Project Two",
    category: "Residential",
    image: process.env.PUBLIC_URL + "/imagess/adva2.PNG"
  },
  {
    id: 3,
    title: "Project Three",
    category: "Commercial",
    image: process.env.PUBLIC_URL + "/imagess/adva3.PNG"
  },
  {
    id: 4,
    title: "Project Four",
    category: "Residential",
    image: process.env.PUBLIC_URL + "/imagess/adva4.PNG"
  },
  {
    id: 5,
    title: "Project Five",
    category: "Commercial",
    image: process.env.PUBLIC_URL + "/imagess/adva5.PNG"
  },
  {
    id: 6,
    title: "Project Six",
    category: "Residential",
    image: process.env.PUBLIC_URL + "/imagess/advas.PNG"
  },
  {
    id: 7,
    title: "Project Seven",
    category: "Commercial",
    image: process.env.PUBLIC_URL + "/imagess/baalfest8.PNG"
  },
  {
    id: 8,
    title: "Project Eight",
    category: "Residential",
    image: process.env.PUBLIC_URL + "/imagess/kabataş.PNG"
  }
];

const About = () => (
  <AboutPage>
    <AboutContent>
      <AboutTitle>About DKC Group</AboutTitle>
      <AboutText>
        DKC Group is a leading architectural design studio specializing in creating innovative and sustainable spaces 
        that seamlessly blend form and function. With a focus on both residential and commercial projects, 
        we bring unique visions to life through thoughtful design and meticulous attention to detail.
      </AboutText>
      <AboutText>
        Our team of experienced architects and designers is dedicated to delivering exceptional results 
        that exceed our clients' expectations. From concept to completion, we work closely with our clients 
        to ensure their vision is realized while maintaining the highest standards of quality and sustainability.
      </AboutText>
      
      <ContactSection>
        <ContactTitle>İLETİŞİM</ContactTitle>
        <ContactGrid>
          <ContactItem>
            <ContactIcon>📞</ContactIcon>
            <ContactType>TELEFON</ContactType>
            <ContactInfo>
              <ContactName>CİHANGİR DİKİCİ</ContactName>
              <ContactRole>İNŞAAT MÜHENDİSİ</ContactRole>
              <ContactValue>0(549) 732 19 00</ContactValue>
            </ContactInfo>
          </ContactItem>
          
          <ContactItem>
            <ContactIcon>✉️</ContactIcon>
            <ContactType>EMAIL</ContactType>
            <ContactInfo>
              <ContactValue>dkcgroupantalya@gmail.com</ContactValue>
            </ContactInfo>
          </ContactItem>
          
          <AddressCard>
            <AddressInfo>
              <AddressIcon>📍</AddressIcon>
              <AddressType>ADRES</AddressType>
              <AddressText>
                Gebizli mah. Termessos cad.<br />
                GLK Plaza A1-4<br />
                Muratpaşa / ANTALYA
              </AddressText>
            </AddressInfo>
            <AddressImage>
              <img 
                src={process.env.PUBLIC_URL + "/imagess/glk.PNG"} 
                alt="GLK Plaza Location" 
              />
            </AddressImage>
          </AddressCard>
        </ContactGrid>
      </ContactSection>
    </AboutContent>
  </AboutPage>
);

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Layout>
        <Routes>
          <Route path="/" element={<ProjectGrid projects={projects} />} />
          <Route path="/about" element={<About />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
