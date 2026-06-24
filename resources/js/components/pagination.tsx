import {Link} from "@inertiajs/react";
import React, {MouseEventHandler} from "react";
import {Button} from "@/components/ui/button";

export type Link = {
    active: boolean;
    label: string;
    page: number|null;
    url: string|null;
}
interface Props {
    links: Link[],
    onClick?: (link: Link) => void
}
export default function Pagination({ links, onClick }: Props) {
    return (
        <div className="mt-4 flex flex-wrap gap-1">
            {links.map((link: Link, index: number) => (
                <Button
                    variant="ghost"
                    key={index}
                    onClick={() => onClick?.(link)}
                    className={`rounded-md px-3 py-1 text-sm transition-colors cursor-pointer ${
                        link.active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    )
}
