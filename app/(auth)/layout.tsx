import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-container flex-1 items-center justify-center px-md py-4xl">
      <div className="w-full max-w-md space-y-lg">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="RABS — Roots & Botanical Solutions logo"
            width={56}
            height={56}
            className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-surface-container-low shadow-elevation-mid"
            priority
          />
          <h1 className="mt-sm font-display text-headline-lg text-on-surface">
            RABS Portal
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Administration — Roots &amp; Botanical Solutions
          </p>
        </div>
        {children}
        <p className="text-center text-body-sm text-on-surface-variant">
          <Link href="https://rabs-storefront.vercel.app" className="text-primary underline underline-offset-2">
            ← back to the store
          </Link>
        </p>
      </div>
    </div>
  );
}