import NavBar from "../../Navbar";
import Footer from "../Footer";

const ContactUs = () => {
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center mt-[2rem] bg-gray-100 p-4 md:p-6">
                <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg w-full max-w-lg my-[5rem]">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Contact Us</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                                autoComplete="off"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@mail.com"
                                autoComplete="off"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="+1234567890"
                                autoComplete="off"
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Message</label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your message here..."
                                rows={4}
                                style={{ fontSize: "16px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-300  p-3 rounded-lg font-semibold hover:bg-yellow-200 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs;