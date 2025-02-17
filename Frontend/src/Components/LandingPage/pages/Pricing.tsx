import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper styles
import "swiper/css/pagination";
import { Pagination } from "swiper/modules"; // Import Swiper pagination module
import Footer from "../Footer";
import NavBar from "../../Navbar";

const Pricing = () => {
    const plans = [
        {
            name: "Basic Plan",
            price: "$19/month",
            features: ["✔ 5 Document Processings", "✔ Email Support", "✔ Standard Security"],
        },
        {
            name: "Pro Plan",
            price: "$49/month",
            features: ["✔ 20 Document Processings", "✔ Priority Support", "✔ Enhanced Security"],
        },
        {
            name: "Enterprise Plan",
            price: "$99/month",
            features: ["✔ Unlimited Processing", "✔ Dedicated Support", "✔ Advanced Security"],
        },
    ];

    return (
        <>
        <NavBar/>
        <div className="flex flex-col items-center justify-center my-[10rem]  py-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Choose Your Plan</h2>

            {/* Desktop View - Cards in a Row */}
            <div className="hidden lg:flex gap-8">
                {plans.map((plan, index) => (
                    <div key={index} className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
                        <p className="text-3xl font-bold text-yellow-400 mb-4">{plan.price}</p>
                        <ul className="text-gray-600 mb-6 space-y-2">
                            {plan.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <Link
                            to="/login"
                            className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                ))}
            </div>

            {/* Mobile View - Swiper Carousel */}
            <div className="lg:hidden w-full px-6">
                <Swiper
                    slidesPerView={1} // Show 1 slide at a time
                    spaceBetween={20} // Spacing between slides
                    pagination={{ clickable: true }} // Enable pagination dots
                    modules={[Pagination]} // Use the pagination module
                    className="w-full max-w-md"
                >
                    {plans.map((plan, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:border hover:border-yellow-300 transition duration-300
">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{plan.name}</h3>
                                <p className="text-3xl font-bold text-yellow-400 mb-4">{plan.price}</p>
                                <ul className="text-gray-600 mb-6 space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <Link
                                    to="/login"
                                    className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Pricing;
