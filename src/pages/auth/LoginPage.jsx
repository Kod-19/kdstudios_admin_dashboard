import React from 'react'

const LoginPage = () => {

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in user:", userCredential.user);
      } catch (error) {
        console.error("Login error:", error.message);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <h1 className='text-4xl font-bold text-white'>
            Login Page
        </h1>
    </div>
  )
}

export default LoginPage