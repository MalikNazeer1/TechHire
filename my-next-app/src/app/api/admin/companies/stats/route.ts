// /api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch actual statistics from the database
    const totalCompanies = await prisma.company.count();

    const verifiedCompanies = await prisma.company.count({
      where: { verified: true },
    });

    const unverifiedCompanies = totalCompanies - verifiedCompanies;

    const activeJobDescriptions = await prisma.jobDescription.count({
      where: { isActive: true },
    });

    const avgCompanySizeResult = await prisma.company.aggregate({
      _avg: {
        companySize: true,
      },
    });
    const avgCompanySize = Math.round(
      avgCompanySizeResult._avg.companySize || 0
    );

    // Company growth
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthCompanies = await prisma.company.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    // Industry distribution
    const industries = await prisma.company.groupBy({
      by: ["industry"],
      _count: {
        id: true,
      },
    });

    const industryDistribution = await Promise.all(
      industries.map(async (industry) => {
        const count = industry._count.id;
        const percentage = Math.round((count / totalCompanies) * 100);
        return {
          name: industry.industry,
          value: percentage,
        };
      })
    );

    // Company size distribution
    const companySizes = [
      { min: 1, max: 50, name: "1-50" },
      { min: 51, max: 200, name: "51-200" },
      { min: 201, max: 500, name: "201-500" },
      { min: 501, max: 10000, name: "501+" },
    ];

    const companySizeDistribution = await Promise.all(
      companySizes.map(async (size) => {
        const count = await prisma.company.count({
          where: {
            companySize: {
              gte: size.min,
              ...(size.max < 10000 ? { lte: size.max } : {}),
            },
          },
        });
        const percentage = Math.round((count / totalCompanies) * 100);
        return {
          name: size.name,
          value: percentage || 0,
        };
      })
    );

    const stats = {
      totalCompanies,
      verifiedCompanies,
      unverifiedCompanies,
      activeJobDescriptions,
      avgCompanySize,
      companyGrowth: {
        lastMonth: lastMonthCompanies,
      },
      industryDistribution,
      companySizeDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
