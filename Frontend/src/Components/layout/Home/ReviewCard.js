import ReactStars from "react-rating-stars-component"
import profile from "../../../images/Profile.png"

const ReviewCard = ({ review }) => {
const options={
    edit:false,
    color:"gray",
    activeColor:"tomato",
    size:window.innerWidth<600?20:25,
    value:review.rating,
    isHalf:true
}

    return (
        <div className="reviewCard">
            <img src={profile} alt="user"/>
            <p>{review.name}</p>
            <ReactStars {...options}/>
            <span>{review.comment}</span>
        </div>
    )
}
export default ReviewCard