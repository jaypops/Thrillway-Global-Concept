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
import EditProperty from "@/features/properties/EditProperty";
import { FaRegTrashAlt } from "react-icons/fa";
import { Property } from "@/services/type";
import {
  normalizeProperty,
  useProperty,
} from "@/features/useProperty";
import { useDeleteAllProperty } from "@/features/usePropertyMutation";
import ViewProperty from "@/features/properties/ViewProperty";
import DeleteProperty from "@/features/properties/DeleteProperty";

export const getColumns = (
  onEdit: (property: Property) => void,
  setDeleteDialogOpen: (open: boolean) => void,
  setDeleteIds: (ids: string[]) => void,
  setviewProperty: (id: string | null) => void
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
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
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
    header: "Price Classification",
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
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(property._id)}
            >
              Copy property ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setviewProperty(property._id)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onEdit(property);
                setviewProperty(null);
              }}
            >
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeleteIds([property._id]);
                setDeleteDialogOpen(true);
              }}
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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [editingPropertyId, setEditingPropertyId] = React.useState<
    string | null
  >(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState<string[]>([]);
  const [viewProperty, setviewProperty] = React.useState<string | null>(null);

  const deleteAllPropertyMutation = useDeleteAllProperty();
  const { isLoading, isError, data, error } = useProperty();

  const table = useReactTable({
    data,
    columns: getColumns(
      (property) => {
        setEditingPropertyId(property._id);
        setviewProperty(property._id);
      },
      setDeleteDialogOpen,
      setDeleteIds,
      setviewProperty
    ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original._id);
    if (selectedIds.length > 0) {
      setDeleteIds(selectedIds);
      setDeleteDialogOpen(true);
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) {
    console.error("Error loading properties:", error);
    return <div className="p-4 text-red-500">Failed to load properties.</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center text-2xl">
        <h1 className="text-2xl font-bold mb-4">Properties</h1>
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={handleDeleteSelected}
          disabled={
            table.getFilteredSelectedRowModel().rows.length === 0 ||
            deleteAllPropertyMutation.isPending
          }
        >
          <FaRegTrashAlt />
        </Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter addresses..."
          value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("address")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {deleteDialogOpen && (
        <DeleteProperty
          _id={deleteIds.length === 1 ? deleteIds[0] : undefined}
          ids={deleteIds.length > 1 ? deleteIds : undefined}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteIds([]);
            setRowSelection({});
          }}
        />
      )}
      {editingPropertyId && (
        <EditProperty
          propertyId={editingPropertyId}
          onClose={() => setEditingPropertyId(null)}
          onSuccess={() => setEditingPropertyId(null)}
        />
      )}
      {viewProperty && (
        <ViewProperty
          propertyId={viewProperty}
          onClose={() => setviewProperty(null)}
        />
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
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
    </div>
  );
}

export default Properties;
