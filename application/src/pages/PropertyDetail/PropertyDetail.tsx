/* eslint-disable import/no-unresolved */
import './propertydetail.scss'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import ProductImagesSlider from '../../components/property-images-slider'
import { propertyImages } from '../../assets'
import Navbar from '../../components/Navbar'
import { BsBuilding, BsLayoutTextWindow } from 'react-icons/bs'
import { SlLocationPin } from 'react-icons/sl'
import { IconContext } from 'react-icons'
import Button from 'react-bootstrap/Button'
import * as api from '../../API_handler/api'
import { useEffect, useState } from 'react'
import { RealEstate } from '../../resources/realEstate'
import { Ownership } from '../../resources/ownership'
import { Link } from 'react-router-dom'
import { RoomType } from '../../resources/roomType'
import { randomBytes } from 'crypto'

function numberWithComma(number: string) {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
function PropertyDetail() {
  const realEstate: RealEstate = JSON.parse(localStorage['realEstate'])
  const propertyName = realEstate.name
  const propertyPriceMin = localStorage['sellPriceMin']
  const propertyPriceMax = localStorage['sellPriceMax']
  let priceTag: JSX.Element
  if (propertyPriceMax - propertyPriceMin == 0) {
    priceTag = (
      <div className="price">{numberWithComma(propertyPriceMax)} CW</div>
    )
  } else {
    priceTag = (
      <div className="price">
        {numberWithComma(propertyPriceMin)} -{' '}
        {numberWithComma(propertyPriceMax)} CW
      </div>
    )
  }

  const numofRooms = localStorage['numberOfRoom']
  const propertyArea = realEstate.area
  const propertyLocation = realEstate.location
  const propertyType = 'Duplex'
  const propertyNote =
    'With numerous outdoor living and dining spaces, an infinity pool, garden, and an outdoor kitchen, the terrace is the hot spot for hosting. Moving inside, guests will enjoy formal dining for fourteen, a games room, cinema room, and an entertainment lounge with a pool table. If you’re feeling like keeping up your daily routines, there is an office and a fitness area. Breakfast, airport transfer, twenty-four hour security, and daily housekeeping are all included as well.'
  const propertyDescription =
    '5 floors, Japanese garden (35 m2), terrace (27.09 m2), balcony (6.63 m2)'

  const [isLoading, setLoading] = useState(false)
  const [html] = useState([])
  const showRealEstateInfo = () => {
    realEstate.owners.forEach(function (owner: Ownership) {
      if (owner.isSeller) {
        html.push(
          <div className="ownership child">
            <p>
              <b>User ID: </b> {owner.ownerID}
            </p>
            <p>
              <b>Own: </b> {owner.ownershipPercentage}%
            </p>
            <p>
              <b>Sell percentage: </b> {owner.sellPercentage}%
            </p>
            <p>
              <b>Sell price: </b> {owner.sellPrice}
            </p>
            <p>
              <b>Remain no less than </b> {owner.sellThreshold}%{' '}
            </p>

            <Link to="/contract">
              <Button
                className="btn-purchase btn-l"
                variant="purchase"
                onClick={() => {
                  localStorage.setItem('sellerID', owner.ownerID)
                  localStorage.setItem(
                    'ownershipPercentage',
                    owner.ownershipPercentage.toString()
                  )
                  localStorage.setItem(
                    'sellThreshold',
                    owner.sellThreshold.toString()
                  )
                  localStorage.setItem(
                    'sellPercentage',
                    owner.sellPercentage.toString()
                  )
                  localStorage.setItem('sellPrice', owner.sellPrice.toString())
                }}
              >
                Make Purchase
              </Button>
            </Link>
          </div>
        )
      }
    })
  }
  showRealEstateInfo()
  useEffect(() => {
    setLoading(false)
  })

  if (isLoading) {
    return <div>Loading</div>
  } else {
    return (
      <>
        <Navbar />
        <div
          className="child"
          style={{
            width: '700px',
            backgroundColor: '#fff',
            marginTop: '4px',
            marginLeft: '10vw',
            padding: '0px'
          }}
        >
          <h1 className="propertyName">{propertyName}</h1>

          <ProductImagesSlider images={propertyImages} />
          <div></div>
          <div
            className="type-location-area"
            style={{ display: 'flex', margin: '10px' }}
          >
            <IconContext.Provider
              value={{
                className: 'type-area-location-icons',
                size: '30',
                color: '#9B64BC'
              }}
            >
              <h2>
                <BsBuilding /> {propertyType}
              </h2>
              <h2>
                <BsLayoutTextWindow /> {propertyArea} m<sup>2</sup>
              </h2>
              <h2>
                <SlLocationPin /> {propertyLocation}
              </h2>
            </IconContext.Provider>
          </div>
          <div
            style={{
              marginTop: '10px',
              padding: '15px',
              backgroundColor: '#fbf5ff'
            }}
          >
            <p>
              Price:
              <h3>
                {' '}
                {/* {propertyPriceMin} - {propertyPriceMax} CW */}
                {priceTag}{' '}
              </h3>
            </p>
          </div>
          <div style={{ padding: '15px', marginTop: '0' }}>
            <p>
              <h3>Basic characteristics:</h3>
              <ul className="bulletIndent">
                <li>Number of rooms: {numofRooms}</li>
                <li>Description: {propertyDescription}</li>
              </ul>
              <p className="textpropertyNote">{propertyNote} </p>
            </p>
          </div>
        </div>
        {html}
      </>
    )
  }
}

export default PropertyDetail
