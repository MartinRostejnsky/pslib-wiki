import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Footer from "@/components/sidebar/Footer";
import DocumentsMenu from "@/components/sidebar/DocumentsMenu";
import { Suspense } from "react";
import Header from "@/components/sidebar/Header";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Suspense fallback={<span>Loading...</span>}>
            <DocumentsMenu />
          </Suspense>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
