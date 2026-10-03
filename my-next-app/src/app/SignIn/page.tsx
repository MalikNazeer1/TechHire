"use client";

import { Button } from "@/components/ui/button";
import { ImagesSlider } from "@/components/ui/images-slider";
import { motion, AnimatePresence } from "framer-motion";
import SignupFormDemo from "@/app/SignIn/SignUp/page";
import { useState, useEffect } from "react";
import { Building2, UserCircle2, GraduationCap, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import Logo from "/src/app/assets/TechHire.png";
import Image from "next/image";

const images = [
  "https://plus.unsplash.com/premium_photo-1666625102659-12565c311855?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1629905679177-4c4e2623654f?q=80&w=1836&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

type SignInMode = "company" | "interviewer" | "interviewee";

export default function SignIn() {
  const [showSignIn, setShowSignIn] = useState<boolean>(true);
  const [signInMode, setSignInMode] = useState<SignInMode | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleAlert, setShowRoleAlert] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleGoogleSignIn = async () => {
    if (!signInMode) {
      setShowRoleAlert(true);
      const buttons = document.querySelectorAll('.role-button');
      buttons.forEach(button => {
        button.classList.add('animate-shake');
        setTimeout(() => button.classList.remove('animate-shake'), 500);
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: `/SignIn/UserFormPage?role=${signInMode}&isGoogleSignUp=true`,
      });

      if (result?.error) {
        toast.error("Google sign-in failed");
      } else if (result?.ok) {
        console.log("Signed in successfully");
      } else {
        toast.error("Sign-in failed");
      }
    } catch (error) {
      toast.error("Sign-in error");
    } finally {
      setIsLoading(false);
    }
  };

  const ModeButton = ({
    mode,
    icon,
    label,
  }: {
    mode: SignInMode;
    icon: React.ReactNode;
    label: string;
  }) => (
    <Button
      variant={signInMode === mode ? "default" : "outline"}
      className={`role-button flex-1 h-20 sm:h-28 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 ${
        signInMode === mode 
          ? "bg-gradient-to-r from-blue-200 to-blue-300 text-white shadow-lg ring-2 ring-blue-300" 
          : "hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
      }`}
      onClick={() => {
        setSignInMode(mode);
        setShowRoleAlert(false);
      }}
    >
      <div className={`p-1 sm:p-2 ${
        signInMode === mode 
          ? "bg-white/20" 
          : ""
      }`}>
        {icon}
      </div>
      <span className="text-sm sm:text-base font-medium">{label}</span>
    </Button>
  );

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex items-center justify-center px-4 py-8 lg:py-0 lg:px-8 min-h-screen">
        <AnimatePresence mode="wait">
          {showSignIn ? (
            <motion.div
              key="signInForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[450px] space-y-8 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <Link href="/Homepage" className="block mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <Image 
                    src={Logo} 
                    alt="TechHire Logo" 
                    width={180} 
                    height={60}
                    className="rounded-lg object-contain hover:opacity-80 transition-opacity"
                  />
                </div>
              </Link>

              <div className="space-y-3 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  Select your role to continue
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <ModeButton
                  mode="company"
                  icon={<Building2 size={28} className="text-blue-600 dark:text-blue-400 w-6 h-6 sm:w-7 sm:h-7" />}
                  label="Company"
                />
                <ModeButton
                  mode="interviewer"
                  icon={<UserCircle2 size={28} className="text-blue-600 dark:text-blue-400 w-6 h-6 sm:w-7 sm:h-7" />}
                  label="Interviewer"
                />
                <ModeButton
                  mode="interviewee"
                  icon={<GraduationCap size={28} className="text-blue-600 dark:text-blue-400 w-6 h-6 sm:w-7 sm:h-7" />}
                  label="Interviewee"
                />
              </div>
              {showRoleAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center"
                >
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Please select your role to continue
                  </p>
                </motion.div>
              )}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400">
                    Continue with
                  </span>
                </div>
              </div>
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-3 py-6 transition-all duration-300 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white dark:bg-gray-800 rounded-full" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Continue with Google</span>
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="signUpForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SignupFormDemo />
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignIn(true)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden lg:block bg-muted">
        <ImagesSlider className="h-full" images={images}>
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-50 flex flex-col justify-center items-center px-4"
          >
            <motion.p className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300 py-4">
              Streamlining interviews <br /> elevating talent
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-center mt-4 max-w-2xl text-gray-300"
            >
              Join TechHire to transform your hiring process and discover exceptional talent
            </motion.p>
          </motion.div>
        </ImagesSlider>
      </div>
    </div>
  );
}