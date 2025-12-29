import { Input } from "@/components/ui/input";

export default function SearchPage() {
    return (
        <>
            <div className="w-1/2 md:w-1/3 rounded">
                <Input className="border font-bold color-card" type="text" placeholder="Search" />
            </div>
        </>
    );
}