import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function SearchPage() {
    const [search, setSearch] = useState("");
  return (
    <div className="relative w-1/2 md:w-1/4">
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
            <Card className="absolute top-full mt-2 w-full h-[200px] overflow-y-auto shadow-md bg-background">
                <p className="text-center text-gray-500 mt-20">No results yet</p>
            </Card>
        )
      }
      
    </div>
  );
}
