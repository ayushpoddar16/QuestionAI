import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, GraduationCap } from 'lucide-react';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        semester: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            // User is already logged in, redirect to dashboard
            window.location.href = "/dashboard";
        }
    }, []);

    // Semester options
    const semesterOptions = [
        { value: '', label: 'Select your current semester' },
        { value: '1', label: '1st Semester' },
        { value: '2', label: '2nd Semester' },
        { value: '3', label: '3rd Semester' },
        { value: '4', label: '4th Semester' },
        { value: '5', label: '5th Semester' },
        { value: '6', label: '6th Semester' },
        { value: '7', label: '7th Semester' },
        { value: '8', label: '8th Semester' },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!form.password) {
            newErrors.password = 'Password is required';
        }
        if (!form.semester) {
            newErrors.semester = 'Please select your current semester';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convert email to lowercase
        const processedValue = name === 'email' ? value.toLowerCase() : value;

        setForm({ ...form, [name]: processedValue });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
        const response = await fetch('https://questionai-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            const data = await response.json();

            console.log('Login successful! Response data:', data);
            console.log('Token received:', data.token);

            setMessage({ type: 'success', text: 'Login successful!' });

            // Store the token and user data in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Always redirect to text-extractor by default
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        } else {
            const errorData = await response.json();
            console.error('Login failed. Error data:', errorData);
            setMessage({
                type: 'error',
                text: errorData.message || 'Login failed. Please check your credentials.'
            });
        }
    } catch (err) {
        console.error('Login network error:', err);
        setMessage({
            type: 'error',
            text: 'Network error. Please check your connection and try again.'
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
            {/* Back to Home Button - Fixed Position */}
            <div className="fixed top-6 left-6 z-10">
                <button
                    onClick={() => window.location.href = "/"}
                    className="group inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl border border-gray-200/50 hover:border-blue-200 font-medium transition-all duration-200 transform hover:scale-105"
                >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm">Back to Home</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen p-4 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to continue your learning journey</p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        {/* Alert Messages */}
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                                message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                            errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Semester Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Semester
                                </label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <select
                                        name="semester"
                                        value={form.semester}
                                        onChange={handleChange}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${
                                            errors.semester ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    >
                                        {semesterOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.semester && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.semester}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="mt-6 mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                                </div>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <a
                                href="/signup"
                                 className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Create new account
                            </a>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center text-xs text-gray-500">
                            By signing in, you agree to our{' '}
                            <a href="/terms" className="text-blue-600 hover:text-blue-700">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;