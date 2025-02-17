import NavBar from "../../Navbar";
import Footer from "../Footer";

const AboutUs = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6 my-[2rem]">
        <h2 className="text-4xl font-extrabold text-gray-800 my-[2rem] md:mt-[4rem]">About Daizy Express</h2>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed text-center max-w-3xl">
          At Daizy Express, we specialize in providing comprehensive and efficient legal document processing services. 
          Our dedicated team of professionals ensures that your paperwork is handled with the utmost care, accuracy, and confidentiality. 
          Whether you're an individual, a business, or a legal professional, we simplify the document filing process so you can focus on your priorities.
        </p>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed text-center max-w-3xl">
          Our mission is to streamline legal documentation, reducing the complexity and time involved in processing critical paperwork. 
          We aim to provide a seamless, reliable, and stress-free experience for our clients, ensuring legal compliance while maintaining efficiency.
        </p>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Core Values</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg mb-6 max-w-3xl">
          <li><strong>Integrity:</strong> Upholding the highest standards of honesty and ethics in our work.</li>
          <li><strong>Efficiency:</strong> Ensuring prompt and accurate document processing to save time and resources.</li>
          <li><strong>Confidentiality:</strong> Protecting our clients’ sensitive information with strict security measures.</li>
          <li><strong>Customer-Centric Approach:</strong> Prioritizing client needs and delivering personalized service solutions.</li>
        </ul>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Daizy Express?</h3>
        <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center max-w-3xl">
          Choosing Daizy Express means partnering with a trusted leader in legal document processing. 
          Our team is committed to delivering high-quality, prompt, and professional services tailored to your needs. 
          With years of experience in the industry, we have built a reputation for excellence and reliability.
        </p>
        
        <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl">
          Let Daizy Express handle your legal paperwork while you focus on what truly matters. 
          Contact us today to learn more about our services and how we can assist you.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
