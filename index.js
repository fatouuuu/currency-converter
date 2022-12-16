// Select DOM elements for currency dropdown menus, submit button, and exchange rate display
const dropList = document.querySelectorAll("form select")
const fromCurrency = document.querySelector(".from select")
const toCurrency = document.querySelector(".to select")
const getButton = document.querySelector("form button")

// API endpoint for fetching exchange rates
const exchangeRateApi = ` https://v6.exchangerate-api.com/v6/2fd2c2b65936773c27b38551/latest/`;

/**
 * Retrieves the exchange rate between the selected "from" and "to" currencies and displays
 * the result in the exchange rate display element. If there is an error fetching the data,
 * displays an error message.
 */
function getExchangeRate() {
  // Get user-entered amount and exchange rate display element
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");

  // If no amount is entered or the amount is 0, default to 1
  let amountVal = amount.value;
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }

  // Update exchange rate display to show that data is being fetched
  exchangeRateTxt.innerText = "Getting exchange rate...";

  // Fetch exchange rate data from API
  const url = `${exchangeRateApi}${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      // Calculate total exchange rate by multiplying user-entered amount by selected "to" currency rate
      const exchangeRate = result.conversion_rates[toCurrency.value];
      const totalExRate = (amountVal * exchangeRate).toFixed(2);

      // Update exchange rate display with calculated total exchange rate
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      // If there was an error fetching data, display error message
      exchangeRateTxt.innerText = "Something went wrong";
    });
}

// Populate dropdown menus with options for each currency in country_list object
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    // Select KES as default "from" currency and GBP as default "to" currency
    const selected =
      i == 0
        ? currency_code == "KES"
          ? "selected"
          : ""
        : currency_code == "GBP"
        ? "selected"
        : "";

    // Create option element with currency code as text and value
    const optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

    // Insert option element into dropdown menu
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
    // Add event listener to dropdown menu that calls loadFlag function when selection is changed
    dropList[i].addEventListener("change", (e) => {
        loadFlag(e.target);
      });
    }
    
    /**
     * Displays the flag for the selected currency in the dropdown menu element's flag image.
     * @param {HTMLElement} element - The dropdown menu element.
     */
    function loadFlag(element) {
      // Find flag image element in dropdown menu element's parent
      const imgTag = element.parentElement.querySelector("img");
    
      // Look up flag for selected currency in country_list object and display it in flag image element
      for (let country_code in country_list) {
        if (country_code == element.value) {
          imgTag.src = `https://flagcdn.com/48x36/${country_list[country_code].toLowerCase()}.png`;
        }
      }
    }
    
    // Add event listener to submit button that calls getExchangeRate function when clicked
    getButton.addEventListener("click", (e) => {
      e.preventDefault();
      getExchangeRate();
    });
    
    // Add event listener to exchange icon that swaps selected "from" and "to" currencies and calls getExchangeRate function
    const exchangeIcon = document.querySelector("form .icon");
    exchangeIcon.addEventListener("click", () => {
      // Swap selected "from" and "to" currencies
      const tempCode = fromCurrency.value;
      fromCurrency.value = toCurrency.value;
      toCurrency.value = tempCode;
    
      // Update flag images to match new selections
      loadFlag(fromCurrency);
      loadFlag(toCurrency);
    
      // Get updated exchange rate
      getExchangeRate();
    });

/* 
EXPLANATION (bcos i forgot to make commits as i went along)

This code above is for my currency converter single-page application. 
It allows a user to select two currencies, enter an amount, and get the exchange rate between them. 
The exchange rate is fetched from an API at https://v6.exchangerate-api.com/v6/2fd2c2b65936773c27b38551/latest/. 
The user can also click on an exchange icon to swap the two selected currencies.

I first got references to several DOM elements: the currency dropdown menus, the submit button, and the element that will display the exchange rate. 
Then I defined the getExchangeRate function, which uses the fetch function to retrieve the exchange rate from the API, using the selected "from" currency as the base currency. 
If the fetch is successful, it calculates the total exchange rate by multiplying the amount entered by the user by the exchange rate for the selected "to" currency, and displays the result. 
If there is an error fetching the data, it displays an error message.

Then I created a loop that goes through the dropdown menus, creating options for each currency code in the country_list object and inserting them into the menu. 
It also adds an event listener to each dropdown menu that calls the loadFlag function whenever the selection is changed, passing in the dropdown menu element as an argument. 
The loadFlag function looks up the flag for the selected currency in the country_list object and displays it in an image element.

Finally, I added an event listener to the submit button that calls the getExchangeRate function when clicked, 
and another event listener to the exchange icon that swaps the selected currencies and calls the getExchangeRate function.

(I know this doesn't make up for not having a good commit history but I'm out of time and wasted so much time on the signup and login forms)
*/
