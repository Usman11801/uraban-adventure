import Banner from "@/components/Banner";
import TourList from "@/components/tours/TourList";
import ReveloLayout from "@/layout/ReveloLayout";
import { createClient } from "@/lib/supabase/server";

export default async function SightSeeListPage() {
  const supabase = await createClient();

  // Fetch packages for this page
  const { data: packages } = await supabase
    .from("packages")
    .select(
      `
      *,
      category:categories(id, name, slug),
      addons:package_addons(*)
    `
    )
    .eq("status", "active")
    .eq("display_page", "sight-see-list")
    .order("created_at", { ascending: false });

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
      <Banner pageTitle={"Sight Seeing"} pageName={"Sight Seeing"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <TourList page="sight-see-list" section="main" initialTours={tours} />
        </div>
      </section>
    </ReveloLayout>
  );
}
