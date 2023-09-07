import { Fragment, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getProductDetails, clearErrors,newReview } from "../../Store/Actions/productAction"
import './ProductDetails.css'
import ReactStars from 'react-rating-stars-component'
import ReviewCard from "./ReviewCard"
import Loader from "../Loader/Loader"
import MetaData from '../Header/MetaData'
import { useAlert } from "react-alert"
import { addItemsToCart } from "../../Store/Actions/cartAction"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../Store/Constants/productConstant"

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch()
  const alert = useAlert()
  const { product, loading, error } = useSelector((state) => state.productDetails)
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const { id } = useParams()

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("ProductId",id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id))
  }, [dispatch, id, error, alert, reviewError, success])

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    const qty = quantity + 1
    setQuantity(qty)
  }
  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    const qty = quantity - 1
    setQuantity(qty)
  }

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity))
  }
  const options = {
    size:"large",
    value: product.ratings,
    readOnly:true,
    precision:0.5
  }
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name}---E-Commerce`} />
          <div className="productDetails">
            <div>
              {product.images &&
                product.images.map((item, i) => (
                  <img
                    className="carouselImage"
                    key={item.url}
                    src={item.url}
                    alt={`${i} slide`}
                  />
                ))}

            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span>({product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>&#8377;{product.price}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input value={quantity} type="number" readOnly />
                    <button onClick={increaseQuantity}>+</button>
                  </div>{""}
                  <button onClick={addToCartHandler} disabled={product.stock < 1 ? true : false}>Add to Cart</button>
                </div>
                <p>status:{""}
                  <b className={product.stock < 1 ? "redcolor" : "greencolor"}>
                    {product.stock < 1 ? "Out of stock" : "In Stock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description:<p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
            </div>
          </div>
          <h3 className="reviewHeading">Reviews</h3>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
              name="simple-controlled"
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews && product.reviews.map((review) =>
                <ReviewCard review={review} key={review.name} />
              )
              }
            </div>
          ) : (<p className="noReviews">No reviews yet</p>)}
        </Fragment>
      )}
    </Fragment>

  )
}
export default ProductDetails