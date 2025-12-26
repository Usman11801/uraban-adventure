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
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "category/[...slug]/page.js:11",
      message: "Route handler called",
      data: { params: JSON.stringify(params) },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  const { slug } = params;

  // Handle both array and string formats
  let fullPath = "";
  if (Array.isArray(slug)) {
    fullPath = slug.join("/");
  } else if (slug) {
    fullPath = slug;
  } else {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "category/[...slug]/page.js:22",
        message: "No slug in params - calling notFound",
        data: { params: JSON.stringify(params) },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    notFound();
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "category/[...slug]/page.js:24",
      message: "Full path extracted",
      data: { fullPath, isArray: Array.isArray(slug) },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

  const supabase = await createClient();

  // Try to find category with the full path first (in case slug in DB already has -list)
  let { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", fullPath)
    .eq("is_active", true)
    .single();

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "category/[...slug]/page.js:37",
      message: "First category lookup - trying fullPath as slug",
      data: {
        fullPath,
        found: !!category,
        error: categoryError?.message,
        errorCode: categoryError?.code,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "E",
    }),
  }).catch(() => {});
  // #endregion

  // If not found, remove -list suffix and try again
  if (categoryError || !category) {
    // Remove all trailing -list suffixes (handle cases like desert-resort-list-list)
    let categorySlug = fullPath.replace(/(-list)+$/, "");

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "category/[...slug]/page.js:45",
        message: "Category slug after removing -list",
        data: { fullPath, categorySlug },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion

    // Validate category slug is not empty
    if (!categorySlug || categorySlug.trim().length === 0) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "category/[...slug]/page.js:50",
            message: "Empty category slug - calling notFound",
            data: { fullPath, categorySlug },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        }
      ).catch(() => {});
      // #endregion
      notFound();
    }

    // Try to find category with the cleaned slug (without -list)
    const result = await supabase
      .from("categories")
      .select("*")
      .eq("slug", categorySlug)
      .eq("is_active", true)
      .single();

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "category/[...slug]/page.js:58",
        message: "Second category lookup - trying without -list",
        data: {
          categorySlug,
          found: !!result.data,
          error: result.error?.message,
          errorCode: result.error?.code,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "E",
      }),
    }).catch(() => {});
    // #endregion

    if (result.data) {
      category = result.data;
      categoryError = null;
    } else {
      // Still not found, return 404
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "category/[...slug]/page.js:66",
            message: "Category not found in both attempts - calling notFound",
            data: { fullPath, categorySlug },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "E",
          }),
        }
      ).catch(() => {});
      // #endregion
      notFound();
    }
  }

  // Get the actual category slug for use in TourList
  const categorySlug = category.slug || fullPath.replace(/(-list)+$/, "");

  if (categoryError || !category) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "category/[...slug]/page.js:72",
        message: "Final check failed - calling notFound",
        data: {
          categoryError: categoryError?.message,
          hasCategory: !!category,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "E",
      }),
    }).catch(() => {});
    // #endregion
    notFound();
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "category/[...slug]/page.js:75",
      message: "Category found successfully",
      data: {
        categoryId: category.id,
        categoryName: category.name,
        categorySlug: category.slug,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "A",
    }),
  }).catch(() => {});
  // #endregion

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

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/c0cffba1-d502-4b81-a0b4-d003caf941d5", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "category/[...slug]/page.js:85",
      message: "Packages fetched",
      data: {
        categoryId: category.id,
        packageCount: packages?.length || 0,
        error: packagesError?.message,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      runId: "run1",
      hypothesisId: "F",
    }),
  }).catch(() => {});
  // #endregion

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
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
