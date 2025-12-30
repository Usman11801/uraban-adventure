"use client";
import EmbedPopup from "@/components/popup/EmbedPopup";
import ImageView from "@/components/popup/ImageView";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FloatingCall from "@/components/FloatingCall";
import { roveloUtility } from "@/utility";
import { useEffect } from "react";
import niceSelect from "react-nice-select";
import Footer from "./Footer";
import Header from "./Header";
const ReveloLayout = ({ children, header, footer, insta, sideBar }) => {
  useEffect(() => {
    roveloUtility.animation();
    roveloUtility.fixedHeader();
  }, []);

  useEffect(() => {
    return () => {
      niceSelect();
    };
  }, []);

  return (
    <div className={`page-wrapper ${sideBar ? "for-sidebar-menu" : ""}`}>
      <EmbedPopup />
      <ImageView />
      <FloatingCall phoneNumber="+971528067631" />
      <FloatingWhatsApp
        encodedMessage={
          "Hey! I am interested in your tour packages. Can you help me?"
        }
      />
      <Header header={header} />
      {children}
      <Footer footer={footer} insta={insta} />
    </div>
  );
};
export default ReveloLayout;
