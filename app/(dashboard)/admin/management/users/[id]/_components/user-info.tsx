"use client";

import { Mail, Shield, User2 } from "lucide-react";
import { ProfileAvatar } from "@/components/profile-avatar";

export function UserInfo({ data }: { data: any }) {
  return (
    <div className="flex gap-6">
      <ProfileAvatar username={data?.username} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <User2 className="h-5 w-5" />: <span>{data?.username}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />: <span>{data?.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />: <span>{data?.role}</span>
        </div>
      </div>
    </div>
  );
}
