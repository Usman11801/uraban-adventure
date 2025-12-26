import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function ExecutiveTourListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Executive Tour"} pageName={"Executive Tour"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="executive-tour-list" 
            detailPage="/executive-tour-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
