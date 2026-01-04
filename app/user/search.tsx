import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SearchPage({className}: {className?: string}) {
    const [search, setSearch] = useState("");
  return (
    <div className={cn("relative w-1/2 md:w-1/4", className)}>
      <Input
        className="border font-bold font-bold color-card placeholder:text-secondary"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/*search results dropdown - if search exist, modify to fetch data ah */}
      {
        search && (
            <Card className="absolute top-full mt-2 w-full z-50 h-[200px] overflow-y-auto shadow-md bg-background">
                <p className="text-center text-gray-500 mt-20">No results yet</p>
            </Card>
        )
      }
      
    </div>
  );
}
