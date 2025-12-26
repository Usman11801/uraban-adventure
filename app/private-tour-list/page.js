import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";
import DynamicTourList from "@/components/tours/DynamicTourList";

export default function PrivateTourListPage() {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Private Tour"} pageName={"Private Tour"} search />
      <section className="tour-list-page py-100 rel z-1">
        <div className="container">
          <DynamicTourList 
            displayPage="private-tour-list" 
            detailPage="/private-tour-details"
          />
        </div>
      </section>
    </ReveloLayout>
  );
}
