// URL at which the API server is running
base_url = "http://0.0.0.0:8000";

function getSelectedText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];

        chrome.scripting.executeScript(
            {
                target: { tabId: tab.id },              // Specify a target to inject JavaScript
                function: _getSelectedTextFromTab,      // Function to be injected into the target
            },
            ([res]) => {
                // If selection is not empty, populate the input textarea
                if (res["result"] !== "") {
                    document.getElementById("input_text").value = res["result"];
                }
            }
        );
    });
};

// Get the selected text from the current page
function _getSelectedTextFromTab() {
    var selection = window.getSelection().toString();
    return selection;
}

// Issue a POST request with a request body
function doPost(url, body, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xmlHttp.send(body);
}

// Obtain the results from the API server
function getResults() {
    document.getElementById("results").style.display = "none";

    let error_box = document.getElementById("error_box");
    let text = document.getElementById("input_text").value;
    let loading_text = document.getElementById("loading_text");
    
    // If there is no input text, throw error 
    if (text == "") {
        error_box.innerHTML = "No text available to help you :( Please enter something!";
        error_box.style.display = "block";
    }
    else {
        error_box.style.display = "none";

        // Start displaying the spinner
        loading_text.innerHTML = "Fetching results...";
        document.getElementById("loading").style.display = "block";

        // Create the JSON request body as specified in the API endpoint
        var body = JSON.stringify({
            text: text
        })

        let predict_url = `${base_url}/predict/`;     // POST endpoint to be hit

        doPost(predict_url, body, (res, err) => {
            // Stop displaying the spinner on receiving a response
            document.getElementById("loading").style.display = "none";
            if(err){
                error_box.innerHTML = "Sorry! Error in fetching your results :(";
                error_box.style.display = "block";
            }
            else {
                res = JSON.parse(res)
                // MIGHT NEED TO DYNAMICALLY POPULATE THE PII
                // Populate the output textarea with the paraphrased and summarized text
                // document.getElementById("paraphrased_text").value = res.paraphrased.text;
                // document.getElementById("summarized_text").value = res.summarized.text;
                
                // Populate the synonyms of keywords
                // populateSynonyms(res.keyword_synonyms.response);
                // render(res.name_entities.render_data)
                // Display the output in the popup
                document.getElementById("results").style.display = "block";
            }
        })
    }
}


function render(render_data) {
    text = render_data.text;
    spans = render_data.ents;
    render_str = ``
    var offset = 0
    spans.forEach(({start, end, label}) => {
        const fragment = text.slice(offset, start)
        const entity = text.slice(start, end);
        render_str += fragment
        render_str += `<mark data-entity="${label}">${entity}</mark>`
        offset = end
    }); 
    render_str += text.slice(offset)
    document.getElementById("ner_results").innerHTML = render_str;
}

document.addEventListener("DOMContentLoaded", getSelectedText);
document.getElementById("submit_text").addEventListener("click", getResults);