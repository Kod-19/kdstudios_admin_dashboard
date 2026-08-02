import React from 'react'
import { auth, createUserWithEmailAndPassword } from '../firebase';

const SignUpPage = () => {

    const handleSignup = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Registered user:", userCredential.user);
        } catch (error) {
            console.error("Signup error:", error.message);
        }
    };

  return (
    <div>

    </div>
  )
}

export default SignUpPage