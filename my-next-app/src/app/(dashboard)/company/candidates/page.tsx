export const dynamic = "force-dynamic";

import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import ManagerClient from "@/components/tables/manager-tables/client";

const breadcrumbItems = [
  { title: "Dashboard", link: "/company" },
  { title: "Candidates", link: "/company/candidates" },
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbItems} />
        <ManagerClient />
      </div>
    </PageContainer>
  );
}
