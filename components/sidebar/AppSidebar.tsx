import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu
} from "@/components/ui/sidebar";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {db} from "@/db/drizzle";
import {Documents} from "@/db/schema";
import NewDocumentButton from "@/components/sidebar/NewDocumentButton";
import SidebarDocumentIcon from "@/components/sidebar/SidebarDocumentIcon";

function GetDocuments() {
    return db.select({
        id: Documents.id,
        name: Documents.name
    }).from(Documents).execute();
}

export default async function AppSidebar() {
    const documents = await GetDocuments();

    return (
        <Sidebar>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {documents.map(item => (
                            <SidebarDocumentIcon key={item.id} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SignedOut>
                    <SignInButton>
                        <Button className={"text-base"}>Sign in</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div>
                        <NewDocumentButton/>
                        <UserButton showName={true} appearance={{
                            elements: {
                                rootBox: 'w-full h-8 transition-colors duration-250 rounded-md hover:bg-sidebar-accent',
                                userButtonTrigger: 'w-full aria-expanded:bg-sidebar-accent',
                                userButtonBox: 'w-full justify-between',
                                userButtonOuterIdentifier: 'text-foreground text-sm'
                            }
                        }}/>
                    </div>
                </SignedIn>
            </SidebarFooter>
        </Sidebar>
    )
}