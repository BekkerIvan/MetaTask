import {Link} from "@inertiajs/react";
import React from "react";

export type Link = {
    active: boolean;
    label: string;
    page: number|null;
    url: string|null;
}
interface Props {
    links: Link[]
}
export default function Pagination({ links }: Props) {
    return (
        <div className="mt-4 flex flex-wrap gap-1">
            {links.map((link: Link, index: number) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    preserveState
                    preserveScroll
                    className={`rounded-md px-3 py-1 text-sm transition-colors ${
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
