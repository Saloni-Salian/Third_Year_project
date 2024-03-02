function getSelectedText() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id }, // Specify a target to inject JavaScript
        function: getSelectedTextFromTabHelper, // Function to be injected into the target
      },
      ([res]) => {
        // If selection is not empty, populate the input textarea
        if (res["result"] !== "") {
          document.getElementById("input_text").value = res["result"];
        }
      }
    );
  });
}

// This is a helper function to get the selected text from the current tab and return the String
function getSelectedTextFromTabHelper() {
  var selectedText = window.getSelection().toString();
  return selectedText;
}

// Issue a POST request with a request body
function doPost(url, body, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("POST", url, true); // true for asynchronous
  xmlHttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xmlHttp.send(body);
}

// Obtain the results from the API server
function getResults() {
  document.getElementById("results").style.display = "none";

  let text = document.getElementById("input_text").value;
  let loading_text = document.getElementById("loading_text");

  // Start displaying the spinner
  loading_text.innerHTML = "Fetching results...";
  document.getElementById("loading").style.display = "block";

  // Create the JSON request body as specified in the API endpoint
  var body = JSON.stringify({
    text: text,
  });

  let predict_url = "http://0.0.0.0:8000/results"; // URL to the API endpoint

  doPost(predict_url, body, (res) => {
    // Stop displaying the spinner on receiving a response
    document.getElementById("loading").style.display = "none";
    res = JSON.parse(res);
    render(res.name_entities.render_data);
    // Display the output in the popup
    document.getElementById("results").style.display = "block";
  });
}

function getColour(label) {
  // Define a color mapping for each entity label
  const colourMap = {
    PREFIX: "blue",
    FIRSTNAME: "blue",
    MIDDLENAME: "blue",
    LASTNAME: "blue",
    FULLNAME: "blue",
    NAME: "blue",
    GENDER: "blue",
    DATE: "blue",
    NUMBER: "blue",
    SEXTYPE: "blue",
    SEX: "blue",
    SSN: "blue",

    IBAN: "yellow",
    BITCOINADDRESS: "yellow",
    ETHEREUMADDRESS: "yellow",
    BIC: "yellow",
    LITECOINADDRESS: "yellow",

    ACCOUNTNAME: "green",
    ACCOUNTNUMBER: "green",
    AMOUNT: "green",
    CURRENCY: "green",
    CREDITCARDNUMBER: "green",
    PIN: "green",
    CURRENCYCODE: "green",
    CURRENCYSYMBOL: "green",
    CREDITCARDISSUER: "green",
    CREDITCARDCVV: "green",
    CURRENCYNAME: "green",

    STREETADDRESS: "red",
    STREET: "red",
    CITY: "red",
    ZIPCODE: "red",
    EMAIL: "red",
    PHONE_NUMBER: "red",
    STATE: "red",
    BUILDINGNUMBER: "red",
    MASKEDNUMBER: "red",
    SECONDARYADDRESS: "red",
    COUNTY: "red",
    TIME: "red",

    JOBDESCRIPTOR: "orange",
    JOBTITLE: "orange",
    COMPANY_NAME: "orange",
    JOBAREA: "orange",
    JOBTYPE: "orange",

    URL: "pink",
    USERNAME: "pink",
    PASSWORD: "pink",
    DISPLAYNAME: "pink",

    IPV4: "purple",
    IPV6: "purple",
    MAC: "purple",
    USERAGENT: "purple",
    IP: "purple",
  };
  return colourMap[label] || "Turquoise";
}

function render({ ents, text, title }) {
  render_str = "";
  var offset = 0;

  // Iterate through each entity
  ents.forEach(({ start, end, label }) => {
    const fragment = text.slice(offset, start);
    const entity = text.slice(start, end);
    render_str += fragment;
    let colour = getColour(label);
    console.log(colour);
    render_str += `<mark data-entity="${label}" style="background-color: ${colour};">${entity}</mark>`;
    offset = end;
  });

  render_str += text.slice(offset);
  document.getElementById("ner_results").innerHTML = render_str;
}

//This function prevents the user from clicking the submit button unless they have selected text
function activateSubmit() {
  // Get the text area and submit button
  const textArea = document.getElementById("input_text");
  const submitButton = document.getElementById("submit_text");

  // Add an event listener to the text area
  textArea.addEventListener("input", function () {
    // Enable the submit button if there is text in the text area, otherwise disable it
    submitButton.disabled = textArea.value.trim() === "";
  });
}

document.addEventListener("DOMContentLoaded", activateSubmit);
document.addEventListener("DOMContentLoaded", getSelectedText);
document.getElementById("submit_text").addEventListener("click", getResults);
