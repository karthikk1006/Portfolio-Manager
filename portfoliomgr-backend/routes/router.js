const express = require("express")

const {createUser} = require("../controllers/createUser")
const {addShare} = require("../controllers/addshare")
const {getAllShares} = require("../controllers/getAllShares")
const {login} = require("../controllers/login")
const {sellShare} = require("../controllers/sellshare")
const {getStockData} = require("../controllers/getStockData")
const {analysis} = require("../controllers/analysis")
const {liquidate} = require("../controllers/liquidate")
const {getSector} = require("../controllers/getsector")

const router = express.Router()

router.route("/createuser").post(createUser)

router.route("/addshare/:userId").post(addShare)

router.route("/getshares/:userId").get(getAllShares)

router.route("/login").post(login)

router.route("/sellshare").post(sellShare)

router.route("/getstockdata/:userId/:stockSymbol").get(getStockData)

router.route("/analysis").get(analysis)

router.route("/liquidate/:userId").post(liquidate)

router.route("/getsector/:userId").get(getSector)



module.exports = router;