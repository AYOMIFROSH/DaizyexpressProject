import Process from "../Components/LandingPage/Process";
import Proof from "../Components/LandingPage/Proof";
import Serve from "../Components/LandingPage/Serve";
import Navbar from "../Components/Navbar";

const LandingPage = () => {
	return (
		<div className="px-10">
			<Navbar />
            <Serve />
            <Process />
            <Proof />
		</div>
	);
};

export default LandingPage;
