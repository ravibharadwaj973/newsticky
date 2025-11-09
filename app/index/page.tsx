"use client";

import { useAuth } from '../context/AuthContext';
import LoginForm from '../_components/LoginForm';
import RegisterForm from '../_components/RegisterForm';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // ✅ Use effect to handle redirect safely
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't render login/register if redirect is happening
  if (user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📝 Sticky Notes
        </h1>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
