'use client';
import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { User } from "firebase/auth";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    })
    return () => unsubscribe();
  })
  return (
    <nav className="h-20 flex justify-between p-4 align-middle">
      <Link href='/'>
        <Image
          src="/youtube-logo.svg"
          width={90}
          height={20}
          alt="Youtube Logo" />
      </Link>
      <SignIn user={user} />
    </nav>
  );
}