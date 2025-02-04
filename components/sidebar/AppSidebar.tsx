import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu
} from "@/components/ui/sidebar";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import NewDocumentButton from "@/components/sidebar/NewDocumentButton";
import DocumentButton from "@/components/sidebar/DocumentButton";
import NewFolderButton from "@/components/sidebar/NewFolderButton";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {ChevronDown} from "lucide-react";
import {db} from "@/db/drizzle";
import {Documents} from "@/db/schema";
import {isNull} from "drizzle-orm";

async function getFolderContents() {
    const folders = await db.query.Folders.findMany({
        with: {
            documents: true
        },
        orderBy: (folders) => folders.id
    });

    const orphans = await db.select()
        .from(Documents)
        .where(isNull(Documents.folderId));

    return {
        folders,
        orphans
    }
}

export default async function AppSidebar() {
    const {folders, orphans} = await getFolderContents();

    return (
        <Sidebar>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {folders.map((folder) => (
                            <Collapsible key={folder.id} defaultOpen className={"group/collapsible"}>
                                <SidebarGroup>
                                    <SidebarGroupLabel asChild>
                                        <CollapsibleTrigger>
                                            {folder.name}
                                            <ChevronDown
                                                className={"ml-auto transition-transform group-data-[stats=open]/collapsible:rotate-180"}/>
                                        </CollapsibleTrigger>
                                    </SidebarGroupLabel>
                                    <CollapsibleContent>
                                        <SidebarGroupContent>
                                            {folder.documents.map((document) => (
                                                <DocumentButton key={document.id} item={document}/>
                                            ))}
                                        </SidebarGroupContent>
                                    </CollapsibleContent>
                                </SidebarGroup>
                            </Collapsible>
                        ))}

                        {/* Render documents without a folder */}
                        {orphans.length > 0 &&
                            orphans.map(item => (
                                <DocumentButton key={item.id} item={item}/>
                            ))
                        }
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
                    <div className={"flex flex-col gap-1"}>
                        <NewDocumentButton/>
                        <NewFolderButton/>
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