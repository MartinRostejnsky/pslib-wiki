import Image from "next/image";

export default async function Loading() {
    return <div className={"w-full min-h-screen flex justify-center align-middle"}>
        <Image
            className={"animate-spin text-white"}
            priority
            src={"/icons/ring-loading.svg"}
            width={32}
            height={32}
            alt={"Spinner"}
        />
    </div>
}