import "./propertydetail.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import ProductImagesSlider from "../components/product-images-slider";
import { propertyImages } from "../assets";
import Navbar from "../components/Navbar";
// import { Browser as  } from "react--dom";
import { BsBuilding, BsLayoutTextWindow } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { IconContext } from "react-icons";
import Button from "react-bootstrap/Button";

function PropertyDetail() {
  // Variables for Property
  const propertyName = "City Garden Duplex";
  const propertyPrice = "6 Billion VND";
  const numofRooms = "5";
  const propertyArea = "223.92 m2";
  const propertyLocation = "Binh Thanh Dist.";
  const propertyType = "Duplex";
  const propertyNote =
    "With numerous outdoor living and dining spaces, an infinity pool, garden, and an outdoor kitchen, the terrace is the hot spot for hosting. Moving inside, guests will enjoy formal dining for fourteen, a games room, cinema room, and an entertainment lounge with a pool table. If you’re feeling like keeping up your daily routines, there is an office and a fitness area. Breakfast, airport transfer, twenty-four hour security, and daily housekeeping are all included as well.";
  const propertyDescription =
    "5 floors, Japanese garden (35 m2), terrace (27.09 m2), balcony (6.63 m2)";

  // Variables for Ownership
  const userID = "tuitenlaDan";
  const ownPercent = "70%";
  const sellPercent = "50%";
  const totalPrice = "6000000";
  const noRemain = "5%";

  return (
    <>
      <Navbar />
      <div
        className="child"
        style={{
          width: "700px",
          backgroundColor: "#fff",
          marginTop: "4px",
          marginLeft: "10vw",
          padding: "0px",
        }}
      >
        <h1 className="propertyName">{propertyName}</h1>

        <ProductImagesSlider images={propertyImages} />
        <div></div>
        <div
          className="type-location-area"
          style={{ display: "flex", margin: "10px" }}
        >
          <IconContext.Provider
            value={{
              className: "type-area-location-icons",
              size: 30,
              color: "#9B64BC",
            }}
          >
            <h2>
              <BsBuilding /> {propertyType}
            </h2>
            <h2>
              <BsLayoutTextWindow /> {propertyArea}
            </h2>
            <h2>
              <SlLocationPin /> {propertyLocation}
            </h2>
          </IconContext.Provider>
        </div>
        <div
          style={{
            marginTop: "10px",
            padding: "15px",
            backgroundColor: "#fbf5ff",
          }}
        >
          <p>
            Price:
            <h3> {propertyPrice} </h3>
          </p>
        </div>
        <div style={{ padding: "15px", marginTop: "0" }}>
          <p>
            <h3>Basic characteristics:</h3>
            <ul className="bulletIndent">
              <li>Number of rooms: {numofRooms}</li>
              <li>Description: {propertyDescription}</li>
            </ul>
            <p class="propertyNote">{propertyNote} </p>
          </p>
        </div>
      </div>
      <div className="ownership child">
        <p>
          <b>User ID: </b> {userID}
        </p>
        <p>
          <b>Own: </b> {ownPercent}
        </p>
        <p>
          <b>Sell percentage: </b> {sellPercent}
        </p>
        <p>
          <b>Total price: </b> {totalPrice}
        </p>
        <p>
          <b>No remain: </b> {noRemain}{" "}
        </p>

        <Button className="btn-purchase" variant="purchase" size="l">
          Make Purchase
        </Button>
      </div>
    </>
  );
}

export default PropertyDetail;