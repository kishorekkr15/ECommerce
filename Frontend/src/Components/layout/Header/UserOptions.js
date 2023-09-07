import { Fragment, useState } from "react"
import { SpeedDial, SpeedDialAction } from '@material-ui/lab'
import DashboardIcon from "@material-ui/icons/Dashboard"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import ListAltIcon from "@material-ui/icons/ListAlt"
import { Backdrop } from "@material-ui/core"
import { useNavigate } from "react-router-dom"
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../Store/Actions/userAction"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const UserOptions = ({ user }) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state) => state.cart);

    const options = [
        { icon: <ListAltIcon />, name: "orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: profile },
        {
            icon: (
                <ShoppingCartIcon
                    style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
                />
            ),
            name: `Cart(${cartItems.length})`,
            func: cart,
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logout },
    ]

    if (user.role === "admin") {
        options.unshift(
            { icon: <DashboardIcon />, name: "Dashboard", func: dashboard },
        )
    }

    function orders() {
        navigate("/orders")
    }
    function dashboard() {
        navigate("/admin/dashboard")
    }
    function profile() {
        navigate("/profile")
    }
    function cart() {
        navigate("/cart")
    }

    function logout() {
        dispatch(logoutUser())
        alert.success("logout successfully")
    }
    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                className="speedDial"
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/profile.png"}
                        alt="profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>

    )
}
export default UserOptions