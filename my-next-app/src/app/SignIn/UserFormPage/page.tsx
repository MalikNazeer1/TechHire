"use client";

import type React from "react";
import { Loader2 } from "lucide-react";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
type SignInMode = "company" | "interviewer" | "interviewee";
type RedirectPaths = {
  [K in Lowercase<SignInMode>]: string;
};
export default function UserFormPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const isGoogleSignUp = searchParams.get("isGoogleSignUp") === "true";
  const role = searchParams.get("role")?.toLowerCase() || "";

  const [userRole, setUserRole] = useState<SignInMode>(
    (role as SignInMode) || "interviewee"
  );
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkUserProfile = async (email: string) => {
    try {
      console.log("Checking profile for email:", email);
      const response = await fetch(`/api/auth/check-profile?email=${email}`);
      const data = await response.json();
      console.log("Profile check response:", data);

      if (data.hasProfile) {
        const role: SignInMode = data.role.toLowerCase() as SignInMode;
        const userRoleId = data.userRoleId; // Extract userRoleId
        if (role === "company") {
          localStorage.setItem("companyId", userRoleId);
        } else if (role === "interviewer") {
          localStorage.setItem("interviewerId", userRoleId);
        } else if (role === "interviewee") {
          localStorage.setItem("intervieweeId", userRoleId);
        }

        localStorage.setItem("role", role);
        const redirectMap: RedirectPaths = {
          company: "/company",
          interviewer: "/interviewer",
          interviewee: "/interviewee",
        };
        if (redirectMap[role]) {
          router.push(redirectMap[role]);
          toast.success(`Welcome back! Redirecting to your dashboard.`);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Profile check error:", error);
      toast.error("Error checking user profile");
    }
  };

  const fetchSession = async () => {
    try {
      const sessionResponse = await fetch("/api/auth/session");
      const sessionData = await sessionResponse.json();

      console.log("Session data:", sessionData);

      if (sessionData?.user?.email) {
        console.log("Got email from session:", sessionData.user.email);
        await checkUserProfile(sessionData.user.email);
      } else {
        console.log("No email in session data:", sessionData);
        toast.error("Could not retrieve user information");
      }
    } catch (sessionError) {
      console.error("Error fetching session:", sessionError);
      toast.error("Error retrieving session data");
    }
  };

  useEffect(() => {
    fetchSession();
    setIsMounted(true);
    if (role) {
      setUserRole(role as SignInMode);
    }
  }, [role]);

  if (!isMounted) return null;

  const handleRoleChange = (value: string) => {
    setUserRole(value as SignInMode);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const formValues = Object.fromEntries(formData);

      // Prepare the data based on the role
      let roleSpecificData;
      if (userRole === "company") {
        roleSpecificData = {
          industry: formValues.industry,
          description: formValues.description,
          name: formValues.name,
          companySize: Number(formValues.companySize),
          portfolio: formValues.portfolio,
        };
      } else if (userRole === "interviewer") {
        roleSpecificData = {
          expertiseArea: formValues.expertiseArea,
          description: formValues.description,
          resume: formValues.resume,
          skills: formValues.skills
            .toString()
            .split(",")
            .map((skill) => skill.trim()),
          experience: formValues.experience,
        };
      } else {
        roleSpecificData = {
          currentPosition: formValues.currentPosition,
          experienceLevel: formValues.experienceLevel,
          resume: formValues.resume,
          skills: formValues.skills
            .toString()
            .split(",")
            .map((skill) => skill.trim()),
        };
      }

      const payload = {
        isGoogleSignUp: isGoogleSignUp,
        email: session?.user?.email,
        name: session?.user?.name,
        role: userRole,
        data: roleSpecificData,
      };

      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      // Redirect to dashboard or home page after successful registration
      router.push(`/${userRole}`);
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {userRole === "company"
              ? "Company Registration"
              : userRole === "interviewer"
              ? "Interviewer Registration"
              : "Interviewee Registration"}
          </CardTitle>
          <CardDescription>
            {isGoogleSignUp
              ? "Complete your profile to finish registration"
              : "Please fill out the form below to complete your registration."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {!isGoogleSignUp && (
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select
                  value={userRole}
                  onValueChange={handleRoleChange}
                  name="role"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="interviewer">Interviewer</SelectItem>
                    <SelectItem value="interviewee">Interviewee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {userRole === "company" ? (
              <CompanyForm />
            ) : userRole === "interviewer" ? (
              <InterviewerForm />
            ) : (
              <IntervieweeForm />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function CompanyForm() {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" name="industry" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio URL</Label>
        <Input id="portfolio" name="portfolio" type="url" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companySize">Company Size</Label>
        <Input id="companySize" name="companySize" type="number" required />
      </div>
    </>
  );
}

function InterviewerForm() {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Professional Summary</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of your professional background and expertise"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expertiseArea">Area of Expertise</Label>
        <Select name="expertiseArea" required>
          <SelectTrigger>
            <SelectValue placeholder="Select your area of expertise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend Development</SelectItem>
            <SelectItem value="backend">Backend Development</SelectItem>
            <SelectItem value="fullstack">Full Stack Development</SelectItem>
            <SelectItem value="mobile">Mobile Development</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="data">Data Science/Engineering</SelectItem>
            <SelectItem value="ai">AI/Machine Learning</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="qa">QA/Testing</SelectItem>
            <SelectItem value="design">UI/UX Design</SelectItem>
            <SelectItem value="pm">Project Management</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          name="experience"
          type="number"
          min="0"
          max="30"
          placeholder="Enter your years of experience"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          name="skills"
          placeholder="e.g. JavaScript, React, Node.js, System Design"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume">Resume URL</Label>
        <Input
          id="resume"
          name="resume"
          type="url"
          placeholder="Link to your resume/CV or portfolio"
        />
      </div>
    </>
  );
}

function IntervieweeForm() {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="currentPosition">Current Position</Label>
        <Input id="currentPosition" name="currentPosition" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level</Label>
        <Select name="experienceLevel">
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="resume">Resume URL</Label>
        <Input id="resume" name="resume" type="url" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          name="skills"
          placeholder="e.g. JavaScript, React, Node.js"
          required
        />
      </div>
    </>
  );
}
