import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate, Outlet } from "react-router-dom";
import DeleteProperty from "@/features/properties/DeleteProperty";
import Loader from "@/ui/Loader";
import { Property } from "@/services/type";
import { normalizeProperty, useProperty } from "@/features/useProperty";

const globalFilterFn: FilterFn<Property> = (row, _columnId, filterValue) => {
  const search = filterValue.toLowerCase();
  const address = row.getValue("address") as string;
  const id = row.getValue("_id") as string;
  return (
    address?.toLowerCase().includes(search) ||
    id?.toLowerCase().includes(search)
  );
};

interface SetSelectedForDelete {
  (value: { ids: string[]; open: boolean }): void;
}

const getColumns = (
  navigate: ReturnType<typeof useNavigate>,
  setSelectedForDelete: SetSelectedForDelete
): ColumnDef<Property>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("_id")}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Address
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "priceType",
    header: "Price Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priceType")}</div>
    ),
  },
  {
    accessorKey: "propertyType",
    header: "Property Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("propertyType")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const property = normalizeProperty(row.original);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(property._id)}
            >
              Copy property ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/properties/view/${property._id}`)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/properties/edit/${property._id}`)}
            >
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setSelectedForDelete({ ids: [property._id], open: true })
              }
              className="cursor-pointer text-red-600"
            >
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Properties() {
  const navigate = useNavigate();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ _id: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedForDelete, setSelectedForDelete] = React.useState<{ ids: string[]; open: boolean }>({
    ids: [],
    open: false,
  });

  const { isPending, data, error } = useProperty();
  const columns = React.useMemo(
    () => getColumns(navigate, setSelectedForDelete),
    [navigate]
  );

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  if (isPending) return <div className="p-4"><Loader /></div>;
  if (error) return <div className="p-4 text-red-500">Failed to load properties.</div>;

  return (
    <div className="w-full px-3 md:px-6 pt-20">
      <div className="bg-white rounded-3xl shadow-md px-4 md:px-6 py-4">
        <div className="md:flex items-center justify-between py-4 gap-2 space-y-2">
          <Input
            placeholder="Search by address or ID..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm text-xs md:text-sm"
          />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-xs md:text-sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                variant="ghost"
                onClick={() =>
                  setSelectedForDelete({
                    ids: table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original._id),
                    open: true,
                  })
                }
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FaRegTrashAlt className="mr-2 h-4 w-4" />
                Delete Selected (
                {table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {globalFilter
                      ? "No properties match your search."
                      : "No properties found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex md:flex-row flex-col items-center justify-between py-4 gap-3">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} selected.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Delete Modal */}
        {selectedForDelete.open && (
          <DeleteProperty
            ids={selectedForDelete.ids}
            onClose={() => setSelectedForDelete({ ids: [], open: false })}
          />
        )}

        <Outlet />
      </div>
    </div>
  );
}

export default Properties;