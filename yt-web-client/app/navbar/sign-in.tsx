'use client';
import { User } from "firebase/auth";
import { signInWithGoogle, signOut } from "../firebase/firebase"

interface SignInProps {
  user: User | null
}

export default function SignIn({ user }: SignInProps) {
  user

  return (
    <>
      {user ? (
          <button className="border-solid border-2 border-gray rounded-full px-6 py-2 text-blue-600 hover:bg-blue-300 hover:border-transparent" onClick={signOut}>
            Sign Out
          </button>
        ) : (
          <button className="border-solid border-2 border-gray rounded-full px-6 py-2 text-blue-600 hover:bg-blue-300 hover:border-none"
            onClick={signInWithGoogle}>
            Sign In
          </button>
        )
      }
    </>
  )
}