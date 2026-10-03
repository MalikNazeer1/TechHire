import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/companies - Get all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
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

// PATCH /api/admin/companies/:id - Update a company
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(request.url.split("/").pop());
    const data = await request.json();

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        industry: data.industry,
        email: data.email,
        companySize: data.companySize,
        verified: data.verified,
      },
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/companies/:id - Delete a company
export async function DELETE(request) {
  try {
    const id = parseInt(request.url.split("/").pop());

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
