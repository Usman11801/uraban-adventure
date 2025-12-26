import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function ComboDealListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Combo Deals"} pageName={"Combo Deals"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="combo-deal-list" 
            detailPage="/combo-deal-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
