# Privacy Detector

## Description

This project is an NLP powered privacy detector to help people identify what personally identifiable information they are disseminating online.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)

## Installation

1. Clone/Download the repository
2. Upload the Jupyter Notebook named `Deploying_model` onto [Google Colab](https://colab.google)
3. On Google Colab add the ngrok authtoken in `Secrets`, name the secret __NGROK__ and enable notebook access.
4. Run the note on Colab
5. Once the API server from the model is live and running, go the `extension/UI/popup.js` and replace the public URL string in `server_URL` variable.
6. Open Google Chrome and go to Extensions -> Manage Extensions
7. Upload the repository to the 'Load unpacked' section
8. Start using the Extension

## Usage

Input text into the input text box and click 'Display Personal Information'

## Contributing

Saloni Salian, Third-Year student at Queen Mary University of London
