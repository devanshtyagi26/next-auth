"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import "./signin.css";

export default function SignInPage() {
  const { data: session } = useSession();

  return (
    <div className="container">
      <div className="card">
        {session ? (
          <>
            <p className="info">
              Signed in as <strong>{session.user.email}</strong>
            </p>
            <button className="btn" onClick={() => signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="info">You are not signed in</p>
            <button className="btn" onClick={() => signIn()}>
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
