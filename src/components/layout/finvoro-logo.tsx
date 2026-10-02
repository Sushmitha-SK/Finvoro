import assets from "@/assets/assets";
import Image from "next/image";

export function FinvoroLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 shrink-0 items-center justify-center">
                <Image
                    src={assets.logo.src} 
                    alt="Finvoro Logo"
                    width={120}
                    height={32}
                    className="h-12 w-auto object-contain group-data-[collapsible=icon]:hidden dark:hidden"
                    priority
                />

                <Image
                    src={assets.logoDark?.src || assets.logo.src}
                    alt="Finvoro Logo"
                    width={120}
                    height={32}
                    className="hidden h-12 w-auto object-contain group-data-[collapsible=icon]:hidden dark:block"
                    priority
                />
            </div>
        </div>
    );
}