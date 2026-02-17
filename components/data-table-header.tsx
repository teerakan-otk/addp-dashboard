"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

export function DataTableHeader({
  globalFilter,
  setGlobalFilter,
  children,
}: {
  globalFilter: any;
  setGlobalFilter: any;
  children?: any;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <InputGroup className="max-w-60 md:max-w-sm">
        <InputGroupInput
          id="inline-start-input"
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
