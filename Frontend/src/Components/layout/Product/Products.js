import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { useParams } from "react-router-dom"
import { getProduct, clearErrors } from "../../Store/Actions/productAction"
import ProductCard from "../Home/ProductCard"
import Loader from "../Loader/Loader"
import './Product.css'
import Pagination from 'react-js-pagination'
import Slider from "@material-ui/core/Slider"
import { Typography } from "@material-ui/core"
const categories = [
    "laptop",
    "categoryx",
    "Footwear",
    "Bottom",
    "Tops",
    "Camera"
]
const Products = () => {

    const { keyword } = useParams()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }
    const priceHandler = (e, newPrice) => {
        setPrice(newPrice)
    }
    const { loading, products, error, resultPerPage,noOfProducts, filteredProductsCount } = useSelector(state => state.products)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, price, category, alert, error, ratings])

    let count = filteredProductsCount
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                        {products && products.map((product) =>
                            <ProductCard product={product} key={product._id} />
                        )}
                    </div>
                </Fragment>
            )}
            {keyword && (
                <div className="filterBox">
                    <Typography>Price</Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={25000}
                    />
                    <Typography>Categories</Typography>
                    <ul className="categoryBox">
                        {categories.map((category) => (
                            <li
                                className="categoryLink"
                                key={category}
                                onClick={() => setCategory(category)}
                            >{category}</li>
                        ))}
                    </ul>
                    <fieldset>
                        <Typography component="legend">Ratings above</Typography>
                        <Slider value={ratings}
                            onChange={(e, newRating) => {
                                setRatings(newRating)
                            }}
                            aria-labelledby="continous-slider"
                            min={0}
                            max={5}
                            valueLabelDisplay="auto"
                        />
                    </fieldset>
                </div>

            )}

            {resultPerPage < count && (
                <div className="paginationBox">
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={noOfProducts}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Prev"
                        firstPageText="1st"
                        lastPageText="last"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive"
                        activeLinkClass="pageLinkActive"
                    />
                </div>
            )}

        </Fragment>
    )
}
export default Products