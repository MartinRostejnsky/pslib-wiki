"use client"

import {BubbleMenu as BubbleMenuJsx, EditorContent, useEditor, Editor as EditorType} from "@tiptap/react";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import {Blockquote} from "@tiptap/extension-blockquote";
import {BulletList} from "@tiptap/extension-bullet-list";
import {Document} from "@tiptap/extension-document";
import {HardBreak} from "@tiptap/extension-hard-break";
import {Heading} from "@tiptap/extension-heading";
import {HorizontalRule} from "@tiptap/extension-horizontal-rule";
import {ListItem} from "@tiptap/extension-list-item";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {Paragraph} from "@tiptap/extension-paragraph";
import {Text} from "@tiptap/extension-text";
import {Bold} from "@tiptap/extension-bold";
import {Code} from "@tiptap/extension-code";
import {Italic} from "@tiptap/extension-italic";
import {Strike} from "@tiptap/extension-strike";
import {Dropcursor} from "@tiptap/extension-dropcursor";
import {Gapcursor} from "@tiptap/extension-gapcursor";
import {History} from "@tiptap/extension-history";
import {Highlight} from "@tiptap/extension-highlight";
import {BubbleMenu} from "@tiptap/extension-bubble-menu";
import {DragHandle} from "@tiptap-pro/extension-drag-handle-react";
import {useDebouncedCallback} from "use-debounce";
import {Placeholder} from "@tiptap/extension-placeholder";

export default function Editor({content}: {content: string}) {
    const updateDebounced = useDebouncedCallback(
        (editor: EditorType) => {
            const storable = editor.getHTML();
            console.log(storable);
        },
        1000
    );

    const editor = useEditor({
        extensions: [
            Blockquote,
            BulletList,
            CodeBlockShiki.configure({
                defaultTheme: "tokyo-night"
            }),
            Document,
            HardBreak,
            Heading.configure({levels: [1, 2, 3]}),
            HorizontalRule,
            ListItem,
            OrderedList,
            Paragraph,
            Placeholder.configure({
                emptyEditorClass: "is-editor-empty text-gray-500"
            }),
            Text,

            Bold,
            Code,
            Highlight,
            Italic,
            Strike,

            BubbleMenu,
            Dropcursor,
            Gapcursor,
            History
        ],
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-base m-5 px-8 focus:outline-none',
            },
        },
        content: content,
        onUpdate({editor}) {
            updateDebounced(editor);
        }
    });

    if (!editor) return;

    return (
        <div>
            <DragHandle className={"flex items-center justify-center bg-gray-500 rounded-md border border-gray-700 w-6 h-6"} editor={editor}>
                <svg className={"w-4 h-4"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>
                </svg>
            </DragHandle>
            {editor &&
                <BubbleMenuJsx editor={editor} tippyOptions={{duration: 100}}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                        >
                            Strike
                        </button>
                    </div>
                </BubbleMenuJsx>}
            <EditorContent
                editor={editor}
            />
        </div>
    )
}