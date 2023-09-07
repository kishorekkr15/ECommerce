import catchAsyncErrors from "../utils/catchAsyncErrors.js"
import Stripe from "stripe"
const key="sk_test_51Nl410SENUIj37QtpSWALeNdotSb1UtH8kEqzT2D7z4gqXHiNPOKScchzCqqoFL09pjoFKhsFHXh8lLGQBbpMcFF00AgqS4MW5"

export const processPayment = catchAsyncErrors(async (req, res, next) => {

  console.log(key)
  const stripe=new Stripe(key)
  const myPayment = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "inr",
  });
  console.log(myPayment.client_secret)
  res.status(200).json({ success: true, client_secret: myPayment.client_secret});
})

export const sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
})