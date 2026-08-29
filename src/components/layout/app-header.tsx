// "use client";

// import {
//     Bell,
//     Search,
// } from "lucide-react";

// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";

// export function AppHeader() {
//     return (
//         <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
//             <SidebarTrigger />

//             <Separator
//                 orientation="vertical"
//                 className="h-6"
//             />

//             <div className="hidden max-w-md flex-1 md:flex">
//                 <div className="relative w-full">
//                     <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                     <Input
//                         placeholder="Search transactions..."
//                         className="h-9 w-full pl-9"
//                     />
//                 </div>
//             </div>

//             <div className="ml-auto flex items-center gap-1">
//                 <Button
//                     variant="ghost"
//                     size="icon"
//                     aria-label="Notifications"
//                 >
//                     <Bell className="size-5" />
//                 </Button>
//             </div>
//         </header>
//     );
// }

"use client";

import {
    Bell,
    Search,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <SidebarTrigger />

            <Separator
                orientation="vertical"
                className="h-6"
            />

            <div className="hidden max-w-md flex-1 md:flex">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search transactions..."
                        className="h-9 w-full pl-9"
                    />
                </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                >
                    <Bell className="size-5" />
                </Button>

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "size-8",
                        },
                    }}
                />
            </div>
        </header>
    );
}