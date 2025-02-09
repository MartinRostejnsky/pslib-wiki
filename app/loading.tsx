import Image from "next/image";

export default function Loading() {
  return (
    <div className={"flex min-h-screen w-full justify-center align-middle"}>
      <Image
        className={"animate-spin text-white"}
        priority
        src={"/icons/ring-loading.svg"}
        width={32}
        height={32}
        alt={"Spinner"}
      />
    </div>
  );
}
