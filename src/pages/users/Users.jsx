import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table"; // assumed existing
import { listUsers } from "@/services/users.service";

export default function Users() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await listUsers(pageNumber);
      console.log(res)

      // adjust depending on backend response shape
      setData(res|| []);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return new Date(date).toLocaleString();
      },
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <Card>
        <CardContent className="p-4">
          <DataTable columns={columns} data={data} loading={loading} />

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={page === 1 || loading}
              onClick={() => fetchUsers(page - 1)}
            >
              Previous
            </Button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages || loading}
              onClick={() => fetchUsers(page + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
