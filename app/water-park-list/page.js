import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function WaterParkListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Water Parks"} pageName={"Water Parks"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="water-park-list" 
            detailPage="/water-park-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
