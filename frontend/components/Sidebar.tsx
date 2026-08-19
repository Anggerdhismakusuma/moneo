"use client";

import { SIDEBAR_CONSTANTS } from "@/utils/constants";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSidebarClick = (id: string) => {
    router.push(id);
  };

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  }

  return (
    <aside className="bg-sidebar text-sidebar-foreground w-1/5 h-full flex justify-between flex-col p-4 border-r border-sidebar-border">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <Image src={"./logo.svg"} width={40} height={40} alt="Logo Moneo"/>
          <span className="text-sidebar-foreground font-bold text-2xl">
            Moneo
          </span>
        </div>

        <span className="text-sidebar-muted text-xs font-semibold tracking-wider mt-8">
          MENU
        </span>

        <div className="ml-2 mt-4 flex flex-col gap-2">
          {SIDEBAR_CONSTANTS.map((item) => {
            const { icon: Icon, title, id } = item;
            // const itemSelectedClass = id === pathname ? "bg-[#17181c] border-[#242728]" : ""
            const isActive = id === pathname;
            // const itemSelectedClass = isActive
            //   ? "bg-sidebar-accent text-sidebar-accent-foreground"
            //   : "text-sidebar-muted hover:bg-muted hover:text-sidebar-foreground";

            return (
              <div
                key={id}
                className={`flex items-center gap-3 cursor-pointer py-2.5 px-3 rounded-lg w-[95%] border border-transparent transition-colors ${
                  isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-hover"
                }`}
                onClick={() => handleSidebarClick(id)}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : "text-sidebar-muted"}`}
                />
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-muted"
                  }`}
                >
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <SignOutButton redirectUrl="/login">
        <button className="flex items-center gap-3 cursor-pointer py-2.5 px-3 rounded-lg w-full text-sidebar-destructive hover:bg-sidebar-destructive-hover transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </SignOutButton>
    </aside>
  );
};

export default Sidebar;
