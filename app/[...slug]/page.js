import Banner from "@/components/Banner";
import TourList from "@/components/tours/TourList";
import ReveloLayout from "@/layout/ReveloLayout";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryListPage({ params }) {
  console.log(
    "🟡 Root catch-all route called with params:",
    JSON.stringify(params)
  );
  // In Next.js App Router, catch-all routes receive params as an array
  // For route /test-categories-list, params.slug will be ['test-categories-list']
  const { slug } = params;

  // Handle both array and string formats
  let fullPath = "";
  if (Array.isArray(slug)) {
    fullPath = slug.join("/");
  } else if (slug) {
    fullPath = slug;
  } else {
    console.log("CategoryListPage: No slug provided, params:", params);
    notFound();
  }

  console.log("🟡 Root catch-all: Processing path:", fullPath);

  // Skip /category/* paths - they should be handled by app/category/[...slug]/page.js
  // In Next.js, more specific routes should take precedence, but if this route is called
  // for a /category/* path, we need to let Next.js try the more specific route.
  // However, since we can't redirect to another route from here, we should just return 404
  // and let the user know. But actually, Next.js should route to the more specific route first.
  // If we're here, it means Next.js didn't find the category route, so we should notFound().
  // But wait - the issue might be that Next.js IS routing here first. Let's check if the path
  // is exactly "category" followed by something.
  if (fullPath === "category" || fullPath.startsWith("category/")) {
    console.log(
      "🟡 Root catch-all: Path starts with 'category/' - this should be handled by app/category/[...slug]/page.js"
    );
    console.log(
      "🟡 Root catch-all: This suggests Next.js routed here instead of the category route"
    );
    // Call notFound() - this will show 404, but the category route should have been called first
    notFound();
  }

  // Check if path ends with '-list', if not, it's not a category page
  if (!fullPath.endsWith("-list")) {
    console.log("CategoryListPage: Path does not end with -list:", fullPath);
    notFound();
  }

  // Extract category slug from path (remove '-list' suffix)
  const categorySlug = fullPath.replace(/-list$/, "");

  // Validate category slug is not empty
  if (!categorySlug || categorySlug.trim().length === 0) {
    console.log("CategoryListPage: Empty category slug after processing");
    notFound();
  }

  console.log(
    "CategoryListPage: Looking for category with slug:",
    categorySlug
  );

  const supabase = await createClient();

  // Try to find category with the full path first (in case slug in DB already has -list)
  let { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", fullPath)
    .eq("is_active", true)
    .single();

  // If not found, try without -list suffix
  if (categoryError || !category) {
    const result = await supabase
      .from("categories")
      .select("*")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .single();

    if (result.data) {
      category = result.data;
      categoryError = null;
    }
  }

  if (categoryError) {
    console.error("CategoryListPage: Error fetching category:", categoryError);
    notFound();
  }

  if (!category) {
    console.log(
      "CategoryListPage: Category not found for slug:",
      categorySlug,
      "or fullPath:",
      fullPath
    );
    notFound();
  }

  console.log("CategoryListPage: Found category:", category.name);

  // Fetch packages for this category
  const { data: packages, error: packagesError } = await supabase
    .from("packages")
    .select(
      `
      *,
      category:categories(id, name, slug),
      addons:package_addons(*)
    `
    )
    .eq("status", "active")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  if (packagesError) {
    console.error("Error fetching packages:", packagesError);
  }

  // Filter addons to only active ones
  const tours =
    packages?.map((pkg) => ({
      ...pkg,
      name: pkg.name,
      title: pkg.name, // For backward compatibility
      price: pkg.discount_price || pkg.base_price,
      base_price: pkg.base_price,
      discount_price: pkg.discount_price,
      addons: pkg.addons?.filter((addon) => addon.is_active) || [],
    })) || [];

  return (
    <ReveloLayout>
      <Banner
        pageTitle={category.name}
        pageName={category.name}
        search
        backgroundImage={category.image || null}
      />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <TourList
            page={`${categorySlug}-list`}
            section="main"
            initialTours={tours}
            detailPage="/top-tour-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
