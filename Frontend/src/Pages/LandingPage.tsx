import Foot from "../Components/LandingPage/Foot";
import Footer from "../Components/LandingPage/Footer";
import Hero from "../Components/LandingPage/Hero";
import Process from "../Components/LandingPage/Process";
import Proof from "../Components/LandingPage/Proof";
import Serve from "../Components/LandingPage/Serve";
import Navbar from "../Components/Navbar";

const LandingPage = () => {
	return (
		<div className="overflow-x-hidden">
			<Navbar />
			<Hero />
			<Serve />
			<Process />
			<Proof />
			<Foot />
			<Footer />
		</div>
	);
};

export default LandingPage;
