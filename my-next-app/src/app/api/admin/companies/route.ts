// /api/admin/companies/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data: any = {
      name: body.name,
      industry: body.industry,
      companySize: body.companySize,
      email: body.email,
      verified: body.verified || false,
      description: body.description || "",
    };

    if (body.userId) {
      data.user = {
        connect: { id: body.userId },
      };
    }

    const company = await prisma.company.create({
      data,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
