import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      email,
      password,
      name,
      role,
      data,
      isGoogleSignUp = false,
    } = await req.json();
    console.log(email, password, name, role, data, isGoogleSignUp);
    // Validate the incoming data
    if (!email || (!isGoogleSignUp && !password) || !role) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Validate role-specific data
    if (!data) {
      return NextResponse.json(
        { error: "Role-specific data is required" },
        { status: 400 }
      );
    }

    // For Google sign-up, check if user exists and get their ID
    let existingUser;
    if (isGoogleSignUp) {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found. Please sign up with Google first" },
          { status: 404 }
        );
      }
    } else {
      // For manual sign-up, check if email exists
      existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Create or update user based on authentication method
    const result = await prisma.$transaction(async (prisma) => {
      let userId;
      console.log("Creating");
      if (!isGoogleSignUp) {
        // Create new user for manual sign-up
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            email,
            passwordHash,
            name,
            role,
            isActive: true,
          },
        });
        userId = newUser.id;
      } else {
        // Use existing user ID for Google sign-up
        userId = existingUser.id;

        // Update user role if needed
        await prisma.user.update({
          where: { id: userId },
          data: { role },
        });
      }

      // Create role-specific object based on user role
      switch (role.toLowerCase()) {
        case "company":
          if (!data.industry || !data.description || !data.companySize) {
            throw new Error("Missing required company fields");
          }

          await prisma.company.create({
            data: {
              userId,
              description: data.description,
              industry: data.industry,
              email: email,
              name: data.name || name, // Use provided name or fall back to user name
              companySize: data.companySize,
              portfolio: data.portfolio,
              verified: false,
            },
          });
          break;

        case "interviewer":
          if (!data.expertiseArea) {
            throw new Error("Missing required interviewer fields");
          }

          await prisma.interviewer.create({
            data: {
              userId,
              expertiseArea: data.expertiseArea,
              description: data.description,
              level: 0,
              hourlyRate: 0,
              skills: data.skills || [],
              availableSlots: [],
              resume: data.resume || null,
              isVerified: false,
            },
          });
          break;

        case "interviewee":
          if (!data.currentPosition || !data.experienceLevel) {
            throw new Error("Missing required interviewee fields");
          }
          await prisma.interviewee.create({
            data: {
              userId,
              currentPosition: data.currentPosition,
              experienceLevel: data.experienceLevel,
              resume: data.resume,
              skills: data.skills || [],
            },
          });
          break;

        default:
          throw new Error("Invalid role specified");
      }

      return { userId, email, name, role };
    });

    // Return success response
    return NextResponse.json(
      {
        message: isGoogleSignUp
          ? "Profile created successfully for Google user"
          : "User and profile created successfully",
        user: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
