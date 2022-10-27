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

function PropertyDetail() {
  // Variables for Property
  // const [searchParams, setSearchParams] = useSearchParams()
  // searchParams.get('realEstateID')
  // console.log(searchParams)
  const id = localStorage['realEstateID']
  console.log('ID: ' + localStorage['realEstateID'])

  const propertyName = 'City Garden Duplex'
  const propertyPrice = '6 Billion VND'
  const numofRooms = '5'
  const propertyArea = '223.92 m2'
  const propertyLocation = 'Binh Thanh Dist.'
  const propertyType = 'Duplex'
  const propertyNote =
    'With numerous outdoor living and dining spaces, an infinity pool, garden, and an outdoor kitchen, the terrace is the hot spot for hosting. Moving inside, guests will enjoy formal dining for fourteen, a games room, cinema room, and an entertainment lounge with a pool table. If you’re feeling like keeping up your daily routines, there is an office and a fitness area. Breakfast, airport transfer, twenty-four hour security, and daily housekeeping are all included as well.'
  const propertyDescription =
    '5 floors, Japanese garden (35 m2), terrace (27.09 m2), balcony (6.63 m2)'

  // const [info, loadResult] = useState()
  const [isLoading, setLoading] = useState(true)
  const [html, setHtml] = useState([])
  const realEstateInfo = function () {
    api
      .readAsset(id)
      .then(allData => {
        console.log(allData)
        // loadResult(JSON.parse(allData))
        const info = JSON.parse(allData)
        console.log('Info' + info)

        info.owners.forEach(function (owner: Ownership) {
          console.log(owner)

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
                    localStorage.setItem(
                      'sellPrice',
                      owner.sellPrice.toString()
                    )
                  }}
                >
                  Make Purchase
                </Button>
              </Link>
            </div>
          )
        })
        console.log('html' + JSON.stringify(html))

        setLoading(false)
        return
      })
      .catch((error: unknown) => {
        console.log(error)
      })
  }
  realEstateInfo()
  useEffect(() => {
    realEstateInfo()
  })
  // console.log('Start' + JSON.parse(data))
  // const owners = info.owners
  // console.log('Info' + info)

  if (isLoading) {
    console.log('is loading')

    return <div>Loading</div>
  } else {
    console.log('loading finish')

    console.log('Final html' + html)

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
                <BsLayoutTextWindow /> {propertyArea}
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
              <h3> {propertyPrice} </h3>
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
