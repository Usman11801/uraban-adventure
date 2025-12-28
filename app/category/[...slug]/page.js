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
    "🔵 CategoryListPage: Route handler called with params:",
    JSON.stringify(params)
  );

  const { slug } = params;

  // Handle both array and string formats
  let fullPath = "";
  if (Array.isArray(slug)) {
    fullPath = slug.join("/");
  } else if (slug) {
    fullPath = slug;
  } else {
    notFound();
  }

  const supabase = await createClient();

  // Try to find category with the full path first (in case slug in DB already has -list)
  let { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", fullPath)
    .eq("is_active", true)
    .single();

  // If not found, remove -list suffix and try again
  if (categoryError || !category) {
    // Remove all trailing -list suffixes (handle cases like desert-resort-list-list)
    let categorySlug = fullPath.replace(/(-list)+$/, "");

    // Validate category slug is not empty
    if (!categorySlug || categorySlug.trim().length === 0) {
      notFound();
    }

    // Try to find category with the cleaned slug (without -list)
    const result = await supabase
      .from("categories")
      .select("*")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .single();

    if (result.data) {
      category = result.data;
      categoryError = null;
    } else {
      // Still not found, return 404
      notFound();
    }
  }

  // Get the actual category slug for use in TourList
  const categorySlug = category.slug || fullPath.replace(/(-list)+$/, "");

  if (categoryError || !category) {
    notFound();
  }

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

  // Filter addons to only active ones and ensure image URLs are properly formatted
  const tours =
    packages?.map((pkg) => {
      // Ensure image URL is properly formatted
      let imageUrl =
        pkg.image || pkg.image1 || "/assets/images/default-tour.jpg";

      // If image is a relative path without leading slash, add it
      if (
        imageUrl &&
        !imageUrl.startsWith("http") &&
        !imageUrl.startsWith("/")
      ) {
        imageUrl = "/" + imageUrl;
      }

      // If image is empty or null, use default
      if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
        imageUrl = "/assets/images/default-tour.jpg";
      }

      return {
        ...pkg,
        name: pkg.name,
        title: pkg.name, // For backward compatibility
        price: pkg.discount_price || pkg.base_price,
        base_price: pkg.base_price,
        discount_price: pkg.discount_price,
        image: imageUrl, // Ensure image is properly formatted
        addons: pkg.addons?.filter((addon) => addon.is_active) || [],
      };
    }) || [];

  // Get category image for banner, with fallback
  const categoryImage = category.image || null;

  return (
    <ReveloLayout>
      <Banner
        pageTitle={category.name}
        pageName={category.name}
        search
        backgroundImage={categoryImage}
      />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <TourList
            page={`${categorySlug}-list`}
            section="main"
            initialTours={tours}
            detailPage="/top-tour-details"
            showPagination={false}
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
