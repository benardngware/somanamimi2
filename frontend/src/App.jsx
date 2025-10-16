import React, { useState, useEffect } from 'react';

// --- MOCK DATA & API CONFIG ---
const API_URL = 'http://localhost:5000/api';

const mockVideos = {
  numbers: [
    { id: 1, title: 'Learning to Write "1"', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: true, thumbnail: 'https://placehold.co/600x400/3498db/ffffff?text=Video+1' },
    { id: 2, title: 'Counting to Ten', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: true, thumbnail: 'https://placehold.co/600x400/e74c3c/ffffff?text=Video+2' },
    { id: 3, title: 'Introduction to Addition', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: false, thumbnail: 'https://placehold.co/600x400/2ecc71/ffffff?text=Video+3' },
  ],
  letters: [
    { id: 4, title: 'The Letter "A"', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: true, thumbnail: 'https://placehold.co/600x400/9b59b6/ffffff?text=Video+5' },
    { id: 5, title: 'The Sound of "B"', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: true, thumbnail: 'https://placehold.co/600x400/1abc9c/ffffff?text=Video+6' },
    { id: 6, title: 'Writing "C"', url: 'https://www.youtube.com/embed/m_sdo2b2b1s', isFree: false, thumbnail: 'https://placehold.co/600x400/e67e22/ffffff?text=Video+7' },
  ]
};

// --- HELPER HOOK for fetching data ---
const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [url]);
    return { data, loading };
};


// --- ICONS ---
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6.343 17.657l-2.828-2.828m11.314 0l-2.828 2.828M12 21v-4M21 12h-4M12 3v4M3 12h4m1.657-6.343l-2.828 2.828m11.314 0l-2.828-2.828" /></svg>;
const DeviceMobileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;

// --- UI COMPONENTS ---

const Header = ({ setPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = (page) => {
        setPage(page);
        setIsMenuOpen(false);
    };
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-3xl font-bold text-teal-600 cursor-pointer" onClick={() => navigate('home')}>SOMANAMIMI</div>
                <ul className="hidden md:flex items-center space-x-6">
                    <li><a href="#" className="text-gray-700 hover:text-teal-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-teal-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('videos'); }}>Videos</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-teal-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('assignments'); }}>Assignments</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-teal-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('parents'); }}>For Parents</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-teal-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Contact Us</a></li>
                    <li><button className="bg-teal-500 text-white px-5 py-2 rounded-full hover:bg-teal-600 transition-colors" onClick={() => navigate('login')}>Login</button></li>
                </ul>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col items-center space-y-4 py-4">
                        <li><a href="#" className="text-gray-700 hover:text-teal-500" onClick={(e) => { e.preventDefault(); navigate('home'); }}>Home</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-teal-500" onClick={(e) => { e.preventDefault(); navigate('videos'); }}>Videos</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-teal-500" onClick={(e) => { e.preventDefault(); navigate('assignments'); }}>Assignments</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-teal-500" onClick={(e) => { e.preventDefault(); navigate('parents'); }}>For Parents</a></li>
                        <li><a href="#" className="text-gray-700 hover:text-teal-500" onClick={(e) => { e.preventDefault(); navigate('contact'); }}>Contact</a></li>
                        <li><button className="bg-teal-500 text-white w-3/4 py-2 rounded-full hover:bg-teal-600" onClick={() => navigate('login')}>Login</button></li>
                    </ul>
                </div>
            )}
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="text-2xl font-bold mb-4 md:mb-0">SOMANAMIMI</div>
                <p className="mb-4 md:mb-0 text-gray-400">&copy; 2025 SOMANAMIMI. All rights reserved.</p>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-teal-400">Facebook</a>
                    <a href="#" className="hover:text-teal-400">Twitter</a>
                    <a href="#" className="hover:text-teal-400">Instagram</a>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400 space-y-2 md:space-y-0 md:space-x-4">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <span className="hidden md:inline">|</span>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <span className="hidden md:inline">|</span>
                <a href="#" className="hover:text-white">Contact Us</a>
            </div>
        </div>
    </footer>
);

const MpesaModal = ({ video, show, onClose, onPaymentSuccess }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePayment = async () => {
        if (!/^(2547|2541)\d{8}$/.test(phone)) {
            setMessage('Please enter a valid Safaricom number (e.g., 254712345678).');
            return;
        }
        setLoading(true);
        setMessage('Processing payment... Please check your phone.');

        try {
            // This API call initiates the STK push
            const res = await fetch(`${API_URL}/payments/stk-push`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, amount: 10, videoId: video.id }), // Example amount
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('STK push sent! Please enter your M-Pesa PIN on your phone to complete the payment.');
                // Here, you would ideally poll a callback endpoint or use WebSockets to get the payment status.
                // For simplicity, we will simulate a success after a delay.
                setTimeout(() => {
                    onPaymentSuccess();
                    onClose();
                }, 15000); // Simulate 15s wait for user to pay
            } else {
                throw new Error(data.message || 'Payment initiation failed.');
            }
        } catch (error) {
            setMessage(error.message);
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Unlock "{video.title}"</h2>
                <p className="mb-4">To watch this premium video, please complete the payment of KES 10.</p>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="254712345678"
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                    disabled={loading}
                />
                <button
                    onClick={handlePayment}
                    className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
                <button onClick={onClose} className="w-full mt-2 text-gray-600 hover:underline">Cancel</button>
                {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
            </div>
        </div>
    );
};

const VideoCard = ({ video, user, setPage, onUnlockSuccess }) => {
    const [showMpesaModal, setShowMpesaModal] = useState(false);
    const canWatch = video.isFree || user.hasSubscription;

    const handleUnlock = () => {
        if (!user.isLoggedIn) {
            alert('Please log in to unlock videos.');
            setPage('login');
            return;
        }
        setShowMpesaModal(true);
    };

    return (
        <>
            <MpesaModal
                video={video}
                show={showMpesaModal}
                onClose={() => setShowMpesaModal(false)}
                onPaymentSuccess={onUnlockSuccess}
            />
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div className="relative">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover"/>
                    {!video.isFree && (
                        <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md ${canWatch ? 'bg-green-400 text-gray-800' : 'bg-yellow-400 text-gray-800'}`}>
                            <LockIcon />
                            <span className="ml-1">{canWatch ? 'Unlocked' : 'Premium'}</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 h-12">{video.title}</h3>
                    {canWatch ? (
                        <button className="mt-4 w-full py-2 rounded-full text-white font-semibold bg-teal-500 hover:bg-teal-600 transition-colors">
                            Watch Now
                        </button>
                    ) : (
                        <button onClick={handleUnlock} className="mt-4 w-full py-2 rounded-full text-white font-semibold bg-orange-500 hover:bg-orange-600 transition-colors">
                            Unlock Video
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};


const MeetTheInstructor = () => (
    <div className="py-20 bg-teal-50">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Your Instructor</h2>
            <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <img src="https://placehold.co/200x200/34D399/ffffff?text=Instructor" alt="Instructor" className="w-48 h-48 rounded-full object-cover mb-6 md:mb-0 md:mr-8"/>
                <div>
                    <h3 className="text-2xl font-bold text-teal-600 mb-2">Teacher Jane</h3>
                    <p className="text-gray-600 text-lg">With over 10 years of experience in early childhood education, Teacher Jane is passionate about making learning a joyful and magical experience. Her creative approach helps children grasp concepts easily and build a lifelong love for learning. She believes every child is a star and is dedicated to helping them shine brightly!</p>
                </div>
            </div>
        </div>
    </div>
);

// --- PAGE COMPONENTS ---

const HomePage = ({ setPage, user, onUnlockSuccess }) => (
    <div>
        <div className="relative h-[500px] text-white text-center">
            <img src="https://placehold.co/1200x500/34D399/1F2937?text=Welcome+to+Somanamimi!" alt="Happy African children in a colorful classroom" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Learn, Play, and Grow</h1>
                <p className="text-lg md:text-xl max-w-2xl mb-8">Fun and engaging video lessons to help your child thrive.</p>
                <button className="bg-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform" onClick={() => setPage('videos')}>
                    Start Learning
                </button>
            </div>
        </div>
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Parents and Kids Love Us</h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-12">We believe learning should be a joyful adventure. Our lessons are designed by experts to be both educational and entertaining.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                        <BookOpenIcon />
                        <h3 className="text-xl font-semibold text-teal-600 mb-2">Expert-Designed Curriculum</h3>
                        <p className="text-gray-600">Lessons that align with early childhood education standards.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                        <SparklesIcon />
                        <h3 className="text-xl font-semibold text-teal-600 mb-2">Fun & Interactive</h3>
                        <p className="text-gray-600">Engaging content that keeps children excited to learn.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
                        <DeviceMobileIcon />
                        <h3 className="text-xl font-semibold text-teal-600 mb-2">Learn Anywhere</h3>
                        <p className="text-gray-600">Accessible on any device, so learning never has to stop.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-12">Featured Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...mockVideos.numbers.slice(0, 2), ...mockVideos.letters.slice(0, 2)].map(video => 
                        <VideoCard key={video.id} video={video} user={user} setPage={setPage} onUnlockSuccess={onUnlockSuccess} />
                    )}
                </div>
            </div>
        </div>
        <MeetTheInstructor />
    </div>
);

const VideosPage = ({ user, setPage, onUnlockSuccess }) => {
    const [category, setCategory] = useState(null); // null | 'numbers' | 'letters'

    if (category) {
        const videos = mockVideos[category] || [];
        const title = category.charAt(0).toUpperCase() + category.slice(1);
        return (
            <div className="container mx-auto px-6 py-12">
                <button onClick={() => setCategory(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 mb-8 transition-colors">
                    &larr; Back to Categories
                </button>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">{title} Lessons</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {videos.map(video => <VideoCard key={video.id} video={video} user={user} setPage={setPage} onUnlockSuccess={onUnlockSuccess} />)}
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose a Category</h1>
            <p className="text-gray-600 max-w-xl mx-auto mb-12">What would you like to learn today?</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
                <div onClick={() => setCategory('numbers')} className="w-full md:w-96 h-80 bg-blue-400 rounded-2xl flex flex-col justify-center items-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl">
                    <img src="https://placehold.co/150x150/ffffff/3B82F6?text=123" alt="Numbers Icon" className="rounded-full mb-4" />
                    <h2 className="text-4xl font-bold">Numbers</h2>
                </div>
                <div onClick={() => setCategory('letters')} className="w-full md:w-96 h-80 bg-orange-400 rounded-2xl flex flex-col justify-center items-center text-white cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl">
                    <img src="https://placehold.co/150x150/ffffff/F97316?text=ABC" alt="Letters Icon" className="rounded-full mb-4" />
                    <h2 className="text-4xl font-bold">Letters</h2>
                </div>
            </div>
        </div>
    );
};

const AssignmentsPage = () => (
    <div className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Assignments</h1>
            <p className="text-gray-600 text-lg mb-8">Practice what you've learned with our fun and interactive assignments. This feature is coming soon!</p>
            <img src="https://placehold.co/600x400/A78BFA/ffffff?text=Coming+Soon!" alt="Coming Soon" className="mx-auto rounded-lg" />
        </div>
    </div>
);

const ParentsInfoPage = () => (
    <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Information for Parents</h1>
            <div className="text-gray-700 space-y-8 text-lg">
                <p>Welcome, parents! At SOMANAMIMI, we are committed to providing a safe, engaging, and educational environment for your child. Our platform is designed to supplement early childhood education with a curriculum developed by experts.</p>
            </div>
        </div>
    </div>
);

const ContactPage = () => (
    <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Get in Touch</h1>
            <p className="text-center text-gray-600 mb-8">We'd love to hear from you!</p>
            <form>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input type="text" id="name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                    <textarea id="message" rows="5" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
                </div>
                <button type="submit" className="w-full bg-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors">Send Message</button>
            </form>
        </div>
    </div>
);

const AuthPage = ({ onLoginSuccess, setPage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // This is a MOCK API call. Replace with your actual backend call.
        console.log("Attempting to login/register with:", { name, email, password });
        // Mock user data based on email for testing admin role
        const userData = {
            role: email === 'admin@somanamimi.com' ? 'admin' : 'user',
            token: 'fake-jwt-token-for-testing',
            hasSubscription: false,
        };
        onLoginSuccess(userData);
    };

    return (
        <div className="flex justify-center items-center py-12 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                         <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <button type="submit" className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition-colors">
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-6">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-teal-500 hover:underline font-semibold ml-2">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- ADMIN COMPONENTS ---
const AdminDashboard = ({ user, setPage, onLogout }) => {
    const [adminPage, setAdminPage] = useState('manage_videos');
    // Fetch videos logic for the admin panel
    const { data: videos, loading } = useFetch(`${API_URL}/videos`);

    const renderAdminPage = () => {
        switch (adminPage) {
            case 'manage_videos': return <ManageVideos videos={videos} loading={loading} token={user.token} />;
            case 'bulk_email': return <BulkEmail />;
            default: return <ManageVideos videos={videos} loading={loading} token={user.token} />;
        }
    }

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav>
                    <ul>
                        <li className="mb-4"><a href="#" onClick={() => setAdminPage('manage_videos')} className="hover:text-teal-400">Manage Videos</a></li>
                        <li className="mb-4"><a href="#" onClick={() => setAdminPage('bulk_email')} className="hover:text-teal-400">Bulk Email</a></li>
                        <li className="mt-8"><button onClick={onLogout} className="w-full bg-red-500 py-2 rounded-lg">Logout</button></li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-8 bg-gray-100">
                {renderAdminPage()}
            </main>
        </div>
    );
};

const ManageVideos = ({ videos, loading, token }) => {
    // Logic to add/delete videos
    const [title, setTitle] = useState('');
    // ... other form fields

    const handleAddVideo = async (e) => {
        e.preventDefault();
        // Add video API call
        alert('Add video functionality to be implemented.');
    };
    
    const handleDeleteVideo = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            // Delete video API call
            alert('Delete video functionality to be implemented.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Videos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Add New Video</h2>
                <form onSubmit={handleAddVideo}>
                    {/* Form fields for title, description, url, category, is_free */}
                    <input type="text" placeholder="Video Title" className="w-full p-2 border rounded mb-2" value={title} onChange={e => setTitle(e.target.value)} />
                    <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded">Add Video</button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Existing Videos</h2>
                {loading ? <p>Loading videos...</p> : (
                    <ul>
                        {videos.map(video => (
                            <li key={video.id} className="flex justify-between items-center mb-2 p-2 border-b">
                                <span>{video.title}</span>
                                <button onClick={() => handleDeleteVideo(video.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

const BulkEmail = () => (
    <div>
        <h1 className="text-3xl font-bold mb-8">Send Bulk Promotional Emails</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form>
                <input type="text" placeholder="Email Subject" className="w-full p-2 border rounded mb-4" />
                <textarea placeholder="Email body..." rows="10" className="w-full p-2 border rounded mb-4"></textarea>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send Emails</button>
            </form>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState({ isLoggedIn: false, hasSubscription: false, role: 'user', token: null });

  // This would be replaced by a real auth check on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('somanamimi_user');
    if(storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    const newUserState = {
        isLoggedIn: true,
        hasSubscription: userData.hasSubscription || false, // Assuming API sends this
        role: userData.role,
        token: userData.token
    };
    setUser(newUserState);
    localStorage.setItem('somanamimi_user', JSON.stringify(newUserState));
    // Based on role, we decide where to navigate
    if(userData.role === 'admin') {
        // We don't set a page for admin, the main component will render the dashboard
    } else {
        setPage('home');
    }
  };
  
  const handleLogout = () => {
      setUser({ isLoggedIn: false, hasSubscription: false, role: 'user', token: null });
      localStorage.removeItem('somanamimi_user');
      setPage('home'); // Redirect to home on logout
  };
  
  const handlePaymentSuccess = () => {
      alert("Payment successful! You now have access to all premium content.");
      const updatedUser = { ...user, hasSubscription: true };
      setUser(updatedUser);
      localStorage.setItem('somanamimi_user', JSON.stringify(updatedUser));
  };

  if (user.isLoggedIn && user.role === 'admin') {
      return <AdminDashboard user={user} setPage={setPage} onLogout={handleLogout} />;
  }
  
  const renderPage = () => {
    switch(page) {
      case 'home':
        return <HomePage setPage={setPage} user={user} onUnlockSuccess={handlePaymentSuccess}/>; 
      case 'videos':
        return <VideosPage setPage={setPage} user={user} onUnlockSuccess={handlePaymentSuccess} />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'parents':
        return <ParentsInfoPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <AuthPage onLoginSuccess={handleLogin} setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} user={user} onUnlockSuccess={handlePaymentSuccess} />;
    }
  };

  return (
    <div className="bg-white font-sans">
      <Header setPage={setPage} />
      <main className="min-h-screen">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;

