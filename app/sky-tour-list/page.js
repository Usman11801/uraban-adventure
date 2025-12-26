import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function SkyTourListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Sky Tours"} pageName={"Sky Tours"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="sky-tour-list" 
            detailPage="/sky-tour-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
