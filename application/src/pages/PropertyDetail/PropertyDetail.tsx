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
