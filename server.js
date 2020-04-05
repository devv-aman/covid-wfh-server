const express = require("express");
const app = express();

const getCovidData = require("./routes/covidData");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    res.header('Access-Control-Expose-Headers', 'AMP-Redirect-To');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        res.status(200).json({});
    } else next();
});

app.use("/api/v1", getCovidData);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server Running on Port ${PORT}`));