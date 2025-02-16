import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { MouseEventHandler } from "react";

function BubbleMenuButton({
  editor,
  name,
  text,
  onClick,
}: {
  editor: Editor;
  name: string;
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        editor.isActive(name) ? "bg-gray-600" : "hover:bg-gray-800",
        "rounded-md px-1 py-0.5",
      )}
    >
      {text}
    </button>
  );
}

export function BubbleMenu({ editor }: { editor: Editor }) {
  return (
    <div className="flex gap-1 rounded-md bg-black p-1 outline outline-1 outline-gray-400">
      <BubbleMenuButton
        editor={editor}
        name={"bold"}
        text={"Bold"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <BubbleMenuButton
        editor={editor}
        name={"italic"}
        text={"Italic"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <BubbleMenuButton
        editor={editor}
        name={"strike"}
        text={"Strike"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <BubbleMenuButton
        editor={editor}
        name={"code"}
        text={"Code"}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
    </div>
  );
}
