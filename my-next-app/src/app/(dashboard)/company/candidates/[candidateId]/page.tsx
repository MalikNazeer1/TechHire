import { Breadcrumbs } from "@/components/breadcrumbs";
import { CandidateForm } from "@/components/forms/manager-form";
import PageContainer from "@/components/layout/page-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/company" },
  { title: "Candidates", link: "/company/candidates" },
  { title: "Create", link: "/company/candidates/create" },
];
export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CandidateForm initialData={null} key={null} />
      </div>
    </PageContainer>
  );
}
