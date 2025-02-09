import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import NewDocumentButton from "@/components/sidebar/NewDocumentButton";
import DocumentButton from "@/components/sidebar/DocumentButton";
import NewFolderButton from "@/components/sidebar/NewFolderButton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import {
  connectionPool,
  DOCUMENTS_NAME,
  FOLDER_CONTAINS_NAME,
  FOLDERS_NAME,
} from "@/lib/surrealdb";
import { Document, Folder } from "@/lib/types";

interface FolderDocuments extends Folder {
  documents: Document[];
}

async function getFolderContents() {
  const db = await connectionPool.acquire();
  try {
    // language=SQL format=false
    const folders = await db
      .query<
        [FolderDocuments[]]
      >(`SELECT *, (SELECT * FROM ->folderContains->documents) AS documents FROM folders`)
      .then(([folders]) => {
        return folders.map((items) => {
          return {
            id: items.id.toString(),
            name: items.name,
            documents: items.documents.map((document) => {
              return {
                id: document.id.toString(),
                name: document.name,
                content: document.content,
                createdAt: document.createdAt,
              };
            }),
            createdAt: items.createdAt,
          };
        });
      });

    const orphans = await db
      .query<[Document[]]>(
        `SELECT *
         FROM ${DOCUMENTS_NAME}
         WHERE id NOT IN (SELECT VALUE out FROM ${FOLDER_CONTAINS_NAME})`,
      )
      .then(([documents]) => {
        return documents.map((document) => {
          return {
            id: document.id.toString(),
            name: document.name,
          };
        });
      });

    return {
      folders,
      orphans,
    };
  } finally {
    connectionPool.release(db);
  }
}

async function getFolders() {
  const db = await connectionPool.acquire();

  try {
    const folders = await db.query<Folder[]>(`SELECT * FROM ${FOLDERS_NAME}`);
    return folders.map((folder) => {
      return {
        id: folder.id,
        name: folder.name,
      };
    });
  } finally {
    connectionPool.release(db);
  }
}

export default async function AppSidebar() {
  const { folders, orphans } = await getFolderContents();
  const folderNames = await getFolders();

  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {folders.map((folder) => (
              <Collapsible
                key={folder.id}
                defaultOpen
                className={"group/collapsible"}
                asChild
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <span>{folder.name}</span>
                      <ChevronDown
                        className={
                          "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                        }
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {folder.documents.map((document) => (
                        <DocumentButton
                          key={document.id}
                          item={document}
                          folders={folderNames}
                          submenu={true}
                        />
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}

            {/* Render documents without a folder */}
            {orphans.length > 0 &&
              orphans.map((item) => (
                <DocumentButton
                  key={item.id}
                  item={item}
                  folders={folderNames}
                  submenu={false}
                />
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
          <div className={"flex flex-col gap-1"}>
            <NewDocumentButton />
            <NewFolderButton />
            <UserButton
              showName={true}
              appearance={{
                elements: {
                  rootBox:
                    "w-full h-8 transition-colors duration-250 rounded-md hover:bg-sidebar-accent",
                  userButtonTrigger: "w-full aria-expanded:bg-sidebar-accent",
                  userButtonBox: "w-full justify-between",
                  userButtonOuterIdentifier: "text-foreground text-sm",
                },
              }}
            />
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

export const dynamic = "force-dynamic";
