import Image from "next/image";
import { Suspense, type SuspenseProps } from "react";
import { cn } from "@/lib/utils";

const getImage = async () => {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  const image = data.message;
  return image;
};

export default async function Page(
  // {
  //   searchParams,
  // }: {
  //   searchParams?: { image: string };
  // }
) {
  // このようにしてSearchParamsを消すことも可能
  // const image =  searchParams.then((params) => getImage(params.image));
  return (
    <CustomSuspense width="300px" height="300px">
      {/* ResolvePromiseでPromiseをラップしてthenチェーンすることでコンポーネントを作る必要がなくなる */}
      <ResolvePromise>
        {getImage().then((image) => (
          <Image src={image} alt="dog" width={300} height={300} />
        ))}
      </ResolvePromise>
    </CustomSuspense>
  );
}

async function ResolvePromise({
  children,
}: {
  children: Promise<React.ReactNode>;
}) {
  return await children;
}

function CustomSuspense({
  width,
  height,
  className,
  ...props
}: SuspenseProps &
  Pick<React.CSSProperties, "width" | "height"> & {
    className?: string;
  }) {
  return (
    <Suspense
      fallback={
        <div
          style={{ width, height }}
          className={cn("inline-block animate-pulse bg-gray-200", className)}
        />
      }
      {...props}
    />
  );
}
