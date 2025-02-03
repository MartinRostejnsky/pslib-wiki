"use server"

import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {Editor} from "@tiptap/core";
import {auth} from "@clerk/nextjs/server";
import {uuidv4} from "lib0/random";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.S3_REGION ?? "",
    endpoint: process.env.S3_ENDPOINT ?? "",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? "",
        secretAccessKey: process.env.S3_SECRET_KEY ?? "",
    },
});

export async function uploadFileToS3(size: number, type: string) {
    try {
        const {userId} = await auth()

        if (!userId) {
            return {message: 'You must be signed in', url: ""};
        }

        if (size > 25000000) return {
            message: "File too big",
            url: ""
        }

        if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(type)) return {
            message: "Incorrect MIME-type",
            url: ""
        }

        const key = `uploads/${Date.now()}-${uuidv4()}`;
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentLength: size,
            ContentType: type
        })

        return {
            message: "uploading",
            url: await getSignedUrl(s3Client, command, {expiresIn: 900})
        }

    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
