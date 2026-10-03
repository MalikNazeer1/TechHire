import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * API endpoint to generate and download an interview report
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const interviewId = parseInt(params.id, 10);

    if (isNaN(interviewId)) {
      return NextResponse.json(
        { error: "Invalid interview ID" },
        { status: 400 }
      );
    }

    // Find the interview with feedback
    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      include: {
        jobDescription: {
          include: {
            company: true,
          },
        },
        interviewer: true,
        feedbacks: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Check if interview has completed status (case insensitive check)
    const status = interview.status.toUpperCase();
    if (status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Interview report is only available for completed interviews" },
        { status: 400 }
      );
    }

    const feedback = interview.feedbacks[0];
    if (!feedback) {
      return NextResponse.json(
        { error: "No feedback found for this interview" },
        { status: 404 }
      );
    }

    // Format dates
    const interviewDate = new Date(interview.scheduledAt).toLocaleDateString();
    const interviewTime = new Date(interview.scheduledAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Parse fields from feedback
    let candidateInfo = {};
    let technicalSkills = {};
    let detailedAssessment = [];
    
    try {
      const feedbackAny = feedback as any;
      
      if (feedbackAny.candidateInfo) {
        candidateInfo = typeof feedbackAny.candidateInfo === 'string' 
          ? JSON.parse(feedbackAny.candidateInfo) 
          : feedbackAny.candidateInfo;
      } else if (feedbackAny.skillRatings) {
        // Fallback to previous schema
        candidateInfo = {};
      }
      
      if (feedbackAny.technicalSkills) {
        technicalSkills = typeof feedbackAny.technicalSkills === 'string'
          ? JSON.parse(feedbackAny.technicalSkills)
          : feedbackAny.technicalSkills;
      } else if (feedbackAny.skillRatings) {
        // Fallback to previous schema
        technicalSkills = typeof feedbackAny.skillRatings === 'string'
          ? JSON.parse(feedbackAny.skillRatings)
          : feedbackAny.skillRatings;
      }
      
      if (feedbackAny.detailedAssessment) {
        detailedAssessment = typeof feedbackAny.detailedAssessment === 'string'
          ? JSON.parse(feedbackAny.detailedAssessment)
          : feedbackAny.detailedAssessment;
      }
    } catch (e) {
      console.error("Error parsing JSON fields:", e);
    }

    // Generate a simple HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Interview Report - ${interview.intervieweeEmail}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2563eb; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 18px; color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          .interview-meta { display: flex; flex-wrap: wrap; }
          .meta-item { margin-right: 30px; margin-bottom: 10px; }
          .meta-label { font-weight: bold; display: block; font-size: 12px; color: #666; }
          .meta-value { font-size: 14px; }
          .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
          .skill-item { border: 1px solid #eee; padding: 10px; border-radius: 4px; }
          .skill-name { font-weight: bold; }
          .skill-score { float: right; font-weight: bold; }
          .feedback-text { line-height: 1.6; padding: 15px; background: #f9fafb; border-radius: 4px; }
          .decision { font-size: 18px; font-weight: bold; margin-top: 20px; padding: 10px; text-align: center; border-radius: 4px; }
          .strong-yes { background: #d1fae5; color: #065f46; }
          .yes { background: #e0f2fe; color: #0369a1; }
          .no { background: #fef3c7; color: #92400e; }
          .strong-no { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Interview Assessment Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <div class="section-title">Interview Details</div>
          <div class="interview-meta">
            <div class="meta-item">
              <span class="meta-label">Candidate</span>
              <span class="meta-value">${interview.intervieweeEmail}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Position</span>
              <span class="meta-value">${(candidateInfo as any).position || interview.jobDescription?.title || "Unknown Position"}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Company</span>
              <span class="meta-value">${interview.jobDescription?.company?.name || "Unknown Company"}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Date</span>
              <span class="meta-value">${interviewDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Time</span>
              <span class="meta-value">${interviewTime}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Duration</span>
              <span class="meta-value">${interview.durationInMinutes} minutes</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Interviewer</span>
              <span class="meta-value">${interview.interviewer?.name || "Unknown"} (${interview.interviewerEmail})</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Skills Assessment</div>
          <div class="skills-grid">
            ${Object.entries(technicalSkills)
              .map(
                ([skill, score]) => `
              <div class="skill-item">
                <span class="skill-name">${skill}</span>
                <span class="skill-score">${score}/10</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Evaluation Summary</div>
          <div class="meta-item">
            <span class="meta-label">Overall Technical Competence</span>
            <span class="meta-value">${feedback.averageScore.toFixed(1)}/10</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detailed Feedback</div>
          <div class="feedback-text">
            ${detailedAssessment.map((assessment: any) => `
              <h3>${assessment.category}</h3>
              <p><strong>Score:</strong> ${assessment.score}/10</p>
              <p><strong>Description:</strong> ${assessment.description}</p>
              ${assessment.strengths ? `<p><strong>Strengths:</strong> ${assessment.strengths.join(', ')}</p>` : ''}
              ${assessment.areasForImprovement ? `<p><strong>Areas for Improvement:</strong> ${assessment.areasForImprovement.join(', ')}</p>` : ''}
            `).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Hiring Decision</div>
          <div class="decision ${feedback.hiringDecision.toLowerCase().replace("_", "-")}">
            ${feedback.hiringDecision.replace("_", " ")}
          </div>
        </div>

        <div class="footer">
          <p>This report is confidential and intended for internal use only.</p>
          <p>Generated by the Interview-as-a-Service platform</p>
        </div>
      </body>
      </html>
    `;

    // Convert HTML to a Blob with appropriate headers
    const blob = new Blob([htmlContent], { type: "text/html" });
    
    // Return the HTML as a downloadable file
    return new NextResponse(blob, {
      headers: {
        "Content-Disposition": `attachment; filename="interview-report-${interviewId}.html"`,
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    return NextResponse.json(
      { error: "Failed to generate interview report", details: String(error) },
      { status: 500 }
    );
  }
} 