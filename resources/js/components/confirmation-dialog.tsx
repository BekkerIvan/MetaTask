import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type Variant = "delete" | "confirm";

const variantConfig: Record<Variant, {
    title: string;
    description: string;
    actionLabel: string;
    actionClassName: string;
}> = {
    delete: {
        title: "Are you sure you want to delete?",
        description: "This action cannot be undone. This will permanently delete this record from our servers.",
        actionLabel: "Delete",
        actionClassName: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    confirm: {
        title: "Are you sure?",
        description: "Please confirm you want to proceed with this action.",
        actionLabel: "Confirm",
        actionClassName: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
};

interface ConfirmationDialogProps {
    variant?: Variant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    actionLabel?: string;
}

export function ConfirmationDialog({
                                       variant = "confirm",
                                       open,
                                       onOpenChange,
                                       onConfirm,
                                       title,
                                       description,
                                       actionLabel,
                                   }: ConfirmationDialogProps) {
    const config = variantConfig[variant];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title ?? config.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ?? config.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className={cn(config.actionClassName)}
                        onClick={onConfirm}
                    >
                        {actionLabel ?? config.actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
