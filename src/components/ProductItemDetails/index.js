// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    ProductItemDetailsList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount = () => {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        description: data.description,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(eachProduct => ({
          id: eachProduct.id,
          title: eachProduct.title,
          brand: eachProduct.brand,
          imageUrl: eachProduct.image_url,
          rating: eachProduct.rating,
          price: eachProduct.price,
          availability: eachProduct.availability,
        })),
      }
      this.setState({
        ProductItemDetailsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickIncrementQuantity = () => {
    this.setState(prevSate => ({quantity: prevSate.quantity + 1}))
  }

  onClickDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevSate => ({quantity: prevSate.quantity - 1}))
    }
  }

  renderProductItemDetailsList = () => {
    const {ProductItemDetailsList, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = ProductItemDetailsList

    return (
      <div className="bg-container">
        <div className="productDetailContainer">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-description">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/- </p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews"> {totalReviews} Reviews </p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">Available: {availability}</p>
            <p className="brand">Brand: {brand}</p>
            <hr className="separator" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-controller-btn1"
                onClick={this.onClickDecrementQuantity}
                data-testid="minus"
              >
                .<BsDashSquare className="quantity-controller-icon" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-controller-btn2"
                onClick={this.onClickIncrementQuantity}
                data-testid="plus"
              >
                .<BsPlusSquare className="quantity-controller-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="unOrder-similar-products-list">
            {similarProducts.map(eachItem => (
              <SimilarProductItem
                similarProductDetails={eachItem}
                key={eachItem.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductItemDetailsFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="product-not-found-text">Product Not Found</h1>
      <Link to="/products">
        <button
          type="button"
          className="continue-shopping-button"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderTestCases = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetailsList()
      case apiStatusConstants.failure:
        return this.renderProductItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-items-details-container">
          {this.renderTestCases()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
