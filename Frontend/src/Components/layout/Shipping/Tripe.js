import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Payment from "./Payment";
const Tripe = () => {
    const [stripeApiKey, setStripeApiKey] = useState("");

    async function getStripeApiKey() {
        const { data } = await axios.get("/api/v1/stripeApiKey");
        console.log(data)
        setStripeApiKey(loadStripe(data.stripeApiKey));
    }

    useEffect(() => {
        getStripeApiKey();
    }, []);

    return (
        <Fragment>
            {stripeApiKey && (
                <Elements stripe={stripeApiKey}>
                    <Payment />
                </Elements>
            )}
        </Fragment>
    )
}
export default Tripe