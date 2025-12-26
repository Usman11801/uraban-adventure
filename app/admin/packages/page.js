import { createServiceClient } from "@/lib/supabase/server";
import PackageTable from "@/components/admin/packages/PackageTable";
import Link from "next/link";

export default async function PackagesPage({ searchParams }) {
  const supabase = createServiceClient();

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  // Build query
  let query = supabase
    .from("packages")
    .select(
      `
      *,
      category:categories(id, name, slug)
    `
    )
    .order("created_at", { ascending: false });

  if (searchParams.category_id) {
    query = query.eq("category_id", searchParams.category_id);
  }

  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }

  if (searchParams.search) {
    query = query.or(
      `name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`
    );
  }

  const { data: packages, error } = await query;

  if (error) {
    console.error("Error fetching packages:", error);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#1C231F",
              margin: 0,
              marginBottom: "8px",
              fontFamily: "var(--heading-font)",
            }}
          >
            Packages
          </h1>
          {packages && (
            <p
              style={{
                color: "#484848",
                fontSize: "15px",
                margin: 0,
                fontWeight: "500",
              }}
            >
              {packages.length} package{packages.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
        <Link
          href="/admin/packages/new"
          className="admin-primary-button"
          style={{
            background: "linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)",
            color: "white",
            padding: "14px 28px",
            borderRadius: "12px",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "600",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 15px rgba(99,171,69,0.3)",
            transition: "all 0.3s ease",
          }}
        >
          ➕ Create Package
        </Link>
      </div>

      {error && (
        <div
          style={{
            background: "#fed7d7",
            color: "#c53030",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fc8181",
          }}
        >
          <strong>Error loading packages:</strong> {error.message}
        </div>
      )}

      {!error && packages && packages.length === 0 && (
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ color: "#718096", marginBottom: "16px" }}>
            No packages found. Create your first package to get started!
          </p>
          <Link
            href="/admin/packages/new"
            className="admin-primary-button"
            style={{
              background: "linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)",
              color: "white",
              padding: "14px 28px",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              display: "inline-block",
              boxShadow: "0 4px 15px rgba(99,171,69,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            ➕ Create First Package
          </Link>
        </div>
      )}

      {!error && packages && packages.length > 0 && (
        <PackageTable
          packages={packages}
          categories={categories || []}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
