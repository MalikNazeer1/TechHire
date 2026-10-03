// File: app/api/company/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  findCompanyByEmail,
  getInterviewStatistics,
} from "@/lib/utils/company";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Company email is required" },
        { status: 400 }
      );
    }

    try {
      const { companyId } = await findCompanyByEmail(email);
      const statistics = await getInterviewStatistics(companyId);

      return NextResponse.json(statistics);
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
