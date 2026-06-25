import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {RowModel, Row} from "@tanstack/react-table";
import {Country} from "@/components/country";

interface Props<TData> {
    open?: boolean;
    onClose: () => void;
    rows: RowModel<TData>
}

export function RowSelectionDialog({ open = false, onClose, rows }: Props<Country>) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.(); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Selected rows</DialogTitle>
                </DialogHeader>
                <ul className="divide-y divide-border max-h-72 overflow-y-auto">
                    {rows.rows.map((row: Row<Country>) => {
                        const country = row.original as Country;
                        return (
                            <li key={row.id} className="flex items-center gap-3 py-2 text-sm">
                                <span className="w-8 shrink-0 rounded bg-muted px-1.5 py-0.5 text-center font-mono text-xs text-muted-foreground">
                                    {country.code}
                                </span>
                                <span className="font-medium">{country.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground">{country.continent}</span>
                            </li>
                        );
                    })}
                </ul>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
