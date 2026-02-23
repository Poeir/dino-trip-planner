import { useState } from 'react';

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login:', { username, password });
    };

    return (
        <div className="relative h-screen w-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center overflow-hidden">
            {/* Animated Wave Background */}
            <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.12 }} />
                            <stop offset="50%" style={{ stopColor: '#14b8a6', stopOpacity: 0.08 }} />
                            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.12 }} />
                        </linearGradient>
                        <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#059669', stopOpacity: 0.1 }} />
                            <stop offset="50%" style={{ stopColor: '#0d9488', stopOpacity: 0.06 }} />
                            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 0.1 }} />
                        </linearGradient>
                    </defs>
                    
                    {/* Wave 1 - Top */}
                    <path
                        d="M0,100 Q480,80 960,100 T1920,100 V0 H0 Z"
                        fill="url(#wave-gradient-1)"
                    >
                        <animate
                            attributeName="d"
                            dur="20s"
                            repeatCount="indefinite"
                            values="
                                M0,100 Q480,80 960,100 T1920,100 V0 H0 Z;
                                M0,100 Q480,120 960,100 T1920,100 V0 H0 Z;
                                M0,100 Q480,80 960,100 T1920,100 V0 H0 Z
                            "
                        />
                    </path>
                    
                    {/* Wave 2 - Top Middle */}
                    <path
                        d="M0,150 Q640,170 1280,150 T2560,150 V0 H0 Z"
                        fill="url(#wave-gradient-2)"
                    >
                        <animate
                            attributeName="d"
                            dur="15s"
                            repeatCount="indefinite"
                            values="
                                M0,150 Q640,170 1280,150 T2560,150 V0 H0 Z;
                                M0,150 Q640,130 1280,150 T2560,150 V0 H0 Z;
                                M0,150 Q640,170 1280,150 T2560,150 V0 H0 Z
                            "
                        />
                    </path>

                    {/* Wave 3 - Bottom */}
                    <path
                        d="M0,980 Q480,960 960,980 T1920,980 V1080 H0 Z"
                        fill="url(#wave-gradient-1)"
                    >
                        <animate
                            attributeName="d"
                            dur="25s"
                            repeatCount="indefinite"
                            values="
                                M0,980 Q480,960 960,980 T1920,980 V1080 H0 Z;
                                M0,980 Q480,1000 960,980 T1920,980 V1080 H0 Z;
                                M0,980 Q480,960 960,980 T1920,980 V1080 H0 Z
                            "
                        />
                    </path>

                    {/* Wave 4 - Bottom Middle */}
                    <path
                        d="M0,930 Q640,910 1280,930 T2560,930 V1080 H0 Z"
                        fill="url(#wave-gradient-2)"
                    >
                        <animate
                            attributeName="d"
                            dur="18s"
                            repeatCount="indefinite"
                            values="
                                M0,930 Q640,910 1280,930 T2560,930 V1080 H0 Z;
                                M0,930 Q640,950 1280,930 T2560,930 V1080 H0 Z;
                                M0,930 Q640,910 1280,930 T2560,930 V1080 H0 Z
                            "
                        />
                    </path>
                </svg>
            </div>

            {/* Login Box */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                            Dino Trip Planner
                        </h1>
                        <p className="text-gray-600 text-sm">Admin Portal</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            เข้าสู่ระบบ
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}