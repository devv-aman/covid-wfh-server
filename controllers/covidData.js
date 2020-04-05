const fs = require("fs");
const axios = require("axios");
const drive = require("drive-db");
const moment = require("moment-timezone");

// @desc    Get all transactions
// @route   GET /api/v1/fetch-covid-data
// @access  Public
exports.fetchCovidData = async (req, res, next) => {
    try {
        const districtWiseDataResp = await axios.get('https://api.covid19india.org/state_district_wise.json');
        const districtWiseData = districtWiseDataResp.data;

        const tabs = [
            {
                label: "statewise",
                tabName: "ovd0hzm"
            },
            {
                label: "timeline",
                tabName: "o6emnqt"
            }
        ];

        const statewiseData = await fetchSheetData({ sheet: "1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk", tabs });

        const data = JSON.stringify({
            state: statewiseData.statewise,
            district: districtWiseData
        });

        const fileName = `covid-data-${moment(new Date()).tz("Asia/Kolkata").format("YMMDD-HHmmss")}.json`;

        try {
            const rawdata = fs.readFileSync('data/fileLists.json');
            const fileLists = JSON.parse(rawdata);

            fileLists.file_lists.push(fileName);
            const fileListsStr = JSON.stringify(fileLists);

            await fs.writeFileSync(`data/${fileName}`, data);
            await fs.writeFileSync(`data/fileLists.json`, fileListsStr);
        }
        catch(err) {
            console.log(err)
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "DATA UPDATED"
        });
    }
    catch(err) {
        console.log(err)
    }
}

// @desc    Get last fetched vocid19 data
// @route   GET /api/v1/get-covid19-data
// @access  Public
exports.getCovid19Data = async (req, res) => {
    try {
        const rawdata = fs.readFileSync('data/fileLists.json');
        const fileLists = JSON.parse(rawdata).file_lists;
        const lastFileName = fileLists[fileLists.length-1];

        const rawCovidData = fs.readFileSync(`data/${lastFileName}`);
        const covidData = JSON.parse(rawCovidData);
        
        res.status(200).json({
            status: "SUCCESS",
            data: covidData
        })
    }
    catch(err) {
        console.log(err)
    }
}

const fetchSheetData = async ({ sheet, tabs }) => {
    let data = {};
    for(let tabsIx = 0; tabsIx < tabs.length; tabsIx++) {
        const tab = tabs[tabsIx];
        data[tab.label] = await drive({ sheet, tab: tab.tabName });
    }

    return data;
}