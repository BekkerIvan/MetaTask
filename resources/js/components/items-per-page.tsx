import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";


export type ItemPerPage = string;
interface Props {
    itemsPerPage: Array<ItemPerPage>;
    value?: ItemPerPage;
    setValue?: (value: ItemPerPage) => void
}
export default function ItemsPerPage({ itemsPerPage, value, setValue }: Props) {
    return (
        <Select onValueChange={(value: ItemPerPage): void|undefined => setValue?.(value)} value={value}>
            <SelectTrigger className="w-1/10">
                <SelectValue placeholder={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {itemsPerPage.map((value: ItemPerPage) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
