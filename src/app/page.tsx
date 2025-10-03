import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Auth System</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          This is a simple authentication and verification system built with
          Next.js 💤
        </p>
        <Button asChild>
          <Link href="/auth/login">
            Sign In / Sign Up
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
