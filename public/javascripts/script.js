console.log('log de test');

// Create an instance of the Stripe object with your publishable API key
var stripe = Stripe('pk_test_51I9olNGuTH4T2efI2efCfZLZ6Qza5284HQRLS2TxmqKsRaVpIVh0Pxqq9NEo1t8gQEwlsnrlDME4WipOXVISX3kM00ldzfSAfZ');
var checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', function () {
    // Create a new Checkout Session using the server-side endpoint you
    // created in step 3.
    fetch('/create-checkout-session', {
    method: 'POST',
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
        alert(result.error.message);
        }
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
});