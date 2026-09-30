import type { Metadata } from "next";
import { ConveniosPage } from "@/components/admin/ConveniosPage";

export const metadata: Metadata = { title: "Convênios e parcerias" };

export default function Page() {
  return <ConveniosPage />;
}
