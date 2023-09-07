import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import FaceIcon from "@material-ui/icons/Face"
import './LoginSignup.css'
import "../../images/Profile.png"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, login, register } from '../Store/Actions/userAction'
import { useAlert } from 'react-alert'
import { useNavigate, useLocation } from 'react-router-dom'
import Loader from '../layout/Loader/Loader'

const LoginSignup = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    console.log(location.search.split("=")[1])
    const alert = useAlert()
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)

    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const SwitcherTab = useRef(null)

    const [loginEmail, setLoginmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [user, setUser] = useState({ name: "", email: "", password: '' })
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png")
    const { name, email, password } = user

    const loginSubmit = (e) => {
        e.preventDefault()
        dispatch(login(loginEmail, loginPassword))

    }


    const redirect = location.search ? (`/${location.search.split("=")[1]}`) : "/profile"
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }


        if (isAuthenticated) {
            navigate(redirect)
        }
    }, [dispatch, error, alert, navigate, isAuthenticated, redirect])

    const SwitchTabs = (e, tab) => {
        if (tab === "login") {
            SwitcherTab.current.classList.add("shiftToNeutral")
            SwitcherTab.current.classList.remove("shiftToRight")
            registerTab.current.classList.remove("shiftToNeutralForm")
            loginTab.current.classList.remove("shiftToLeft")
        }
        if (tab === "register") {
            SwitcherTab.current.classList.add("shiftToRight")
            SwitcherTab.current.classList.remove("shiftToNeutral")
            registerTab.current.classList.add("shiftToNeutralForm")
            loginTab.current.classList.add("shiftToLeft")
        }
    }


    const registerSubmit = (e) => {
        e.preventDefault()
        const Myform = new FormData()
        Myform.set("name", name)
        Myform.set("email", email)
        Myform.set("password", password)
        Myform.set("avatar", avatar)
        dispatch(register(Myform))
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }


    return (

        <Fragment>

            {loading ? <Loader /> :
                <Fragment>
                    <div className='LoginSignupContainer'>
                        <div className='LoginSignupBox'>
                            <div>
                                <div className='login-signup-toggle'>
                                    <p onClick={(e) => SwitchTabs(e, "login")} >LOGIN</p>
                                    <p onClick={(e) => SwitchTabs(e, "register")} >REGISTER</p>
                                </div>
                                <button ref={SwitcherTab}></button>
                            </div>
                            <form
                                className='loginform'
                                ref={loginTab}
                                onSubmit={loginSubmit}
                            >
                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder='E-mail'
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginmail(e.target.value)}
                                    />
                                </div>
                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder='password'
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <Link to="/password/forgot">Forgot password?</Link>
                                <input
                                    type="submit"
                                    value="Login"
                                    className='loginBtn'
                                />
                            </form>
                            <form
                                className='signupForm'
                                ref={registerTab}
                                encType="multiPart/form-data"
                                onSubmit={registerSubmit}
                            >
                                <div className='signupName'>
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder='name'
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className='signupEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        tfype="email"
                                        placeholder='E-mail'
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className='signupPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder='password'
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="iamge/*"
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Register"
                                    className='signupBtn'
                                />
                            </form>
                        </div>
                    </div >
                </Fragment >
            }
        </Fragment>
    )
}
export default LoginSignup