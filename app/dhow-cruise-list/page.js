import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function DhowCruiseListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Dhow Cruise"} pageName={"Dhow Cruise"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="dhow-cruise-list" 
            detailPage="/dhow-cruise-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
