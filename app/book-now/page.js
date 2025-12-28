import Banner from "@/components/Banner";
import TourList from "@/components/tours/TourList";
import ReveloLayout from "@/layout/ReveloLayout";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BookNowPage() {
  const supabase = await createClient();

  // Fetch all active packages
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
        title: pkg.name,
        price: pkg.discount_price || pkg.base_price,
        base_price: pkg.base_price,
        discount_price: pkg.discount_price,
        image: imageUrl,
        addons: pkg.addons?.filter((addon) => addon.is_active) || [],
      };
    }) || [];

  return (
    <ReveloLayout>
      <Banner
        pageTitle="All Packages"
        pageName="All Packages"
        search
      />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <TourList
            page="all-packages"
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

