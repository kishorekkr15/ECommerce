import { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg'
import './Home.css'
import Product from './ProductCard'
import MetaData from '../Header/MetaData'
import { getProduct,clearErrors } from '../../Store/Actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import { useAlert } from 'react-alert'

const Home = () => {

  const dispatch = useDispatch()
  const { loading, error, products } = useSelector(state => state.products)
  const alert = useAlert()

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct())
  }, [dispatch, error, alert])

  return (
    <Fragment>
      {loading ? <Loader /> : (
        <Fragment>
          <MetaData title="E-Commerce" />
          <div className='banner'>
            <p>Welcome to E-Commerce</p>
            <h1>Find Amazing Products Below</h1>
            <a href='#container'>
              <button>
                Scroll<CgMouse />
              </button>
            </a>
          </div>
          <h2 className='homeHeading'>Featured Products</h2>
          <div className='container' id='container'>
            {products && products.map((product) =>
              <Product product={product} key={product._id} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
export default Home