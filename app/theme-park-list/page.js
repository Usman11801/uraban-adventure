import Banner from "@/components/Banner";
import TourList from "@/components/tours/TourList";
import ReveloLayout from "@/layout/ReveloLayout";
import { createClient } from "@/lib/supabase/server";

export default async function ThemeParkListPage() {
  const supabase = await createClient();

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
    .eq("display_page", "theme-park-list")
    .order("created_at", { ascending: false });

  const tours =
    packages?.map((pkg) => ({
      ...pkg,
      name: pkg.name,
      title: pkg.name,
      price: pkg.discount_price || pkg.base_price,
      base_price: pkg.base_price,
      discount_price: pkg.discount_price,
      addons: pkg.addons?.filter((addon) => addon.is_active) || [],
    })) || [];

  return (
    <ReveloLayout>
      <Banner pageTitle={"Theme Park"} pageName={"Theme Park"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <TourList page="theme-park-list" section="main" initialTours={tours} detailPage="/theme-park-details" />
        </div>
      </section>
    </ReveloLayout>
  );
}
