const express = require("express");
const serveIndex = require("serve-index");
const stripe = require("stripe")(
  "sk_test_51HbLdzExdu4iVGR35rDJBxnkC4iRBAXHzFwZJbTRVfZgT99YEKbqgU0ifFirleq0pA6nDmwrhcf0GPmLStcWWdPA00BvpPSc1H"
);

const app = express();
app.use(express.static('public'));
app.set("view engine", "pug");


app.get("/", async (req, res) => {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
  });

  res.render("home", { prices: prices.data });
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/create-checkout-session/:price_id", async (req, res) => {
  // console.log(req.params.price_id);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: req.params.price_id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000",
  });

  res.redirect(303, session.url);
});

app.listen(3000, () => console.log("Example app is listening on port 3000."));
