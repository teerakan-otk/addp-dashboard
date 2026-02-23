"use client";

import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, X } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  globalFilter: any;
  setGlobalFilter: any;
  children?: any;
};

export function DataTableHeader({
  globalFilter,
  setGlobalFilter,
  children,
}: Props) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="flex items-center justify-between py-4">
      <InputGroup className="max-w-60 md:max-w-sm">
        <InputGroupInput
          placeholder="Search..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>

      {children}
    </div>
  );
}
