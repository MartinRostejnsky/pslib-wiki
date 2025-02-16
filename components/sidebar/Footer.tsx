"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import NewDocumentButton from "@/components/sidebar/NewDocumentButton";
import NewFolderButton from "@/components/sidebar/NewFolderButton";
import { Suspense } from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={"flex flex-col gap-1"}>
      <Suspense fallback={<span>Loading...</span>}>
        <SignedOut>
          <SignInButton>
            <Button className={"text-base"}>Sign in</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
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
        </SignedIn>
      </Suspense>
      <Link
        className="mt-2 text-center text-xs text-muted-foreground"
        href={"https://github.com/Mapetr/pslib-wiki"}
      >
        {`Commit: ${process.env.NEXT_PUBLIC_GIT_HASH || "unknown"}  |  Env: ${process.env.NODE_ENV}`}
      </Link>
    </div>
  );
}
