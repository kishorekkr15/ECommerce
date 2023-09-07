import { Fragment, useEffect, useState } from 'react'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import FaceIcon from "@material-ui/icons/Face"
import "../../../images/Profile.png"
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'
import { clearErrors, loadUser, updateProfile } from '../../Store/Actions/userAction'
import { UPDATE_PROFILE_RESET } from '../../Store/Constants/userConstants'
import './UpdateProfile.css'

const UpdateProfile = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const updateProfileSubmit = (e) => {
        e.preventDefault()
        const Myform = new FormData()
        Myform.set("name", name)
        Myform.set("email", email)
        Myform.set("avatar", avatar)
        dispatch(updateProfile(Myform))
    }

    const updateProfileDataChange = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }
        if (isUpdated) {
            alert.success("profile updated successfully")
            dispatch(loadUser())
            navigate('/profile')
            dispatch({ type: UPDATE_PROFILE_RESET })
        }
    }, [dispatch, error, alert, user, navigate, isUpdated])


    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <div className='updateProfileContainer'>
                        <div className="updateProfileBox">
                            <h2 className="updateProfileheading">Update Profile</h2>
                            <form
                                className='updateProfileForm'
                                encType='multipart/formdata'
                                onSubmit={updateProfileSubmit}
                            >
                                <div className='updateProfileName'>
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder="name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='updateProfileEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div id='updateProfileImage'>
                                    <img src={avatarPreview} alt="avatarPreview" />
                                    <input
                                        type="file"
                                        required
                                        name="avatar"
                                        accept="image/*"
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="update"
                                    className='updateProfileBtn'
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>

    )
}
export default UpdateProfile