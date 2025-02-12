import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Footer from "@/components/sidebar/Footer";
import Header from "@/components/sidebar/Header";
import DocumentsMenu from "@/components/sidebar/DocumentsMenu";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <DocumentsMenu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
