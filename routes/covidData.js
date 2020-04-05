const express = require("express");
const router = express.Router();

const { fetchCovidData, getCovid19Data } = require("../controllers/covidData");

router
    .route("/fetch-covid-data")
    .get(fetchCovidData)

router
    .route("/get-covid19-data")
    .get(getCovid19Data)

module.exports = router;