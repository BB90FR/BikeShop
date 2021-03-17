var express = require('express');
var router = express.Router();


// SHOP

let dataBike = [ 
  {url: './images/bike-1.jpg', name: 'BIKO45', price: 679}, 
  {url: './images/bike-2.jpg', name: 'ZOOK7', price: 799}, 
  {url: './images/bike-3.jpg', name: 'LIKO89', price: 839}, 
  {url: './images/bike-4.jpg', name: 'GEW08', price: 1249}, 
  {url: './images/bike-5.jpg', name: 'KIWIT', price: 899}, 
  {url: './images/bike-6.jpg', name: 'NASAY', price: 1399} 
];

router.get('/', function(req, res, next) {
  res.render('index', { dataBike });
});


// BASKET

router.get('/basket', function(req, res, next) {
    if(req.session.dataCardBike == undefined) { 
    req.session.dataCardBike = []; 
  };

  let alreadyExist = false;

  for (let i = 0; i < req.session.dataCardBike.length; i++) {
      if(req.query.name == req.session.dataCardBike[i].name) {
          req.session.dataCardBike[i].quantity++;
          alreadyExist = true; 
      }
    };
  
  if (!alreadyExist) {
    req.session.dataCardBike.push({url: req.query.url, name: req.query.name, price: req.query.price, quantity: 1})
  };
  
  res.render('basket', { dataCardBike: req.session.dataCardBike } );
});


// DELETE

router.get('/delete', function(req, res, next) {
  req.session.dataCardBike.splice(req.query.position, 1);
  res.render('basket', { dataCardBike: req.session.dataCardBike } );
});

// UPDATE

router.post('/update', function(req, res, next) {
  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
  res.render('basket', { dataCardBike: req.session.dataCardBike } );
});

module.exports = router;


// STRIPE

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I9olNGuTH4T2efI8KGbu8LbBS8D6pHa0yMhkBPinHUwVqjrhlfQEbGLeClcihUH9R1FW812FpduOiKmsabTD7Gj004molDHKF');

router.post('/create-checkout-session', async (req, res) => {
  
  let stripeItems = [];

  for (let i = 0; i < req.session.dataCardBike.length; i++) {

    stripeItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: req.session.dataCardBike[i].name,
            },
            unit_amount: req.session.dataCardBike[i].price * 100
          },
          quantity: req.session.dataCardBike[i].quantity,
    })
  }
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripeItems,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000',
  });  

  res.json({ id: session.id });
});

// SUCCESS PAGE

router.get('/success', function(req, res, next) {
  
  req.session.dataCardBike = [];

  res.render('success', { dataBike });
});