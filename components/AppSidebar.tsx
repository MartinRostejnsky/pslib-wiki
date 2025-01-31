import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "@/components/ui/sidebar";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";

export default async function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
            </SidebarContent>
            <SidebarFooter>
                <SignedOut>
                    <SignInButton>
                        <Button className={"text-base"}>Sign in</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <div className={"flex gap-2"}>
                        <UserButton showName={true} appearance={{
                            elements: {
                                rootBox: 'w-full h-8 transition-colors duration-250 rounded-md hover:bg-sidebar-accent',
                                userButtonTrigger: 'w-full aria-expanded:bg-sidebar-accent',
                                userButtonBox: 'w-full justify-between',
                                userButtonOuterIdentifier: 'text-foreground text-sm'
                            }
                        }} />
                    </div>
                </SignedIn>
            </SidebarFooter>
        </Sidebar>
    )
}