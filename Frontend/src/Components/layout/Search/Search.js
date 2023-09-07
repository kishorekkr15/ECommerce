import { Fragment, useState } from "react"
import {useNavigate} from 'react-router-dom'
import './Search.css'

const Search = () => {

    const [keyword, setKeyword] = useState("")
    const navigate=useNavigate()
    const searchSubmitHandler=(e)=>{
        e.preventDefault()
        if(keyword.trim()){
           navigate(`/products/${keyword}`)
        }else{
            navigate('/products')
        }
    }

    return (
        <Fragment>
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input type="text"
                    placeholder="Search for a product....."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="search" />
            </form>
        </Fragment>
    )
}
export default Search