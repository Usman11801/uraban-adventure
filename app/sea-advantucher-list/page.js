import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function SeaAdvantucherListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Sea Adventure"} pageName={"Sea Adventure"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="sea-advantucher-list" 
            detailPage="/sea-advantucher-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
