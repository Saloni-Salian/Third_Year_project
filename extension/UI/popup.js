// This is a helper function to get the highlighted text from the current tab and return the String
function getHighlightedTextHelper() {
  var highlighted_text = window.getSelection().toString();
  return highlighted_text;
}

// This function gets the current active tab
async function getActiveTab() {
  let tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

// This function fills the textarea with text
async function getHighlightedText() {
  let tab = await getActiveTab();

  // Inject the helper function into the active tab
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getHighlightedTextHelper,
    },
    ([res]) => {
      // If the user highlighted text then fill in the textarea with the text
      if (res["result"] !== "") {
        document.getElementById("input_text").value = res["result"];
      }
    }
  );
}

// This function issues a POST request and deals with the results
async function doPost(url, body, callback) {
  let fetch_options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: body,
  };
  console.log(fetch_options);
  // the function that sends the request
  await fetch(url, fetch_options)
    .then((response) => {
      if (!response.ok) {
        // Handle network/server errors
        document.getElementById("loading").style.display = "none";
        let error_message = document.getElementById("error");
        error_message.innerHTML =
          "An error occured while fetching your results!";
        error_message.style.display = "block";
        console.error("Error during fetch:", error);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      // Function that deals with the returned data
      callback(data);
    })
    .catch((error) => {
      // Handle any other error during the callback
      document.getElementById("loading").style.display = "none";
      let error_message = document.getElementById("error");
      error_message.innerHTML = "An error occured rendering your results";
      error_message.style.display = "block";
      console.error("Error during fetch:", error);
    });
}

//Display the results from the API
function displayResults(res) {
  document.getElementById("loading").style.display = "none";
  render(res.name_entities.data_keys);
  document.getElementById("results").style.display = "block";
}

// This function obtains the results from the API server
function getResults() {
  document.getElementById("results").style.display = "none";
  let text = document.getElementById("input_text").value;
  document.getElementById("loading").style.display = "block";

  // Turn the user's input into a JSON object
  var body = JSON.stringify({
    text: text,
  });

  let predict_url = "http://0.0.0.0:8000/results"; // URL to the API endpoint

  doPost(predict_url, body, displayResults);
}

//This function maps the labels to different colours
function getColour(label) {
  const colourMap = {
    PER: "green",
    ORG: "yellow",
    LOC: "#6495ED",
    MISC: "red",
  };
  return colourMap[label] || "Turquoise";
}

function getColour1(label) {
  // Define a color mapping for each entity label
  const colourMap = {
    PREFIX: "#6495ED",
    FIRSTNAME: "#6495ED",
    MIDDLENAME: "#6495ED",
    LASTNAME: "#6495ED",
    FULLNAME: "#6495ED",
    NAME: "#6495ED",
    GENDER: "#6495ED",
    DATE: "#6495ED",
    NUMBER: "#6495ED",
    SEXTYPE: "#6495ED",
    SEX: "#6495ED",
    SSN: "#6495ED",

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

//This function renders the results of the model into the HTML page
function render({ ents, text, title }) {
  final_output = "";
  var not_entity = 0;

  // Iterate through each entity
  ents.forEach(({ start, end, label }) => {
    let beginning = text.slice(not_entity, start);
    final_output += beginning;
    let entity = text.slice(start, end);

    let colour = getColour(label);
    final_output += `<mark data-entity="${label}" style="background-color: ${colour};">${entity}</mark>`;

    not_entity = end;
  });

  final_output += text.slice(not_entity);
  document.getElementById("ner_results").innerHTML = final_output;
}

//This function prevents the user from clicking the button unless the textarea has text
function activateSubmit() {
  const textArea = document.getElementById("input_text");
  const submitButton = document.getElementById("submit_text");

  // Add an event listener that enbles the button once text has been added.
  textArea.addEventListener("input", () => {
    submitButton.disabled = textArea.value.trim() === "";
  });
}

document.addEventListener("DOMContentLoaded", activateSubmit);
document.addEventListener("DOMContentLoaded", getHighlightedText);
document.getElementById("submit_text").addEventListener("click", getResults);
