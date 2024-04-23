const express = require("express")

const {createUser} = require("../controllers/createUser")
const {addShare} = require("../controllers/addshare")
const {getAllShares} = require("../controllers/getAllShares")

const router = express.Router()

router.route("/createuser").post(createUser)

router.route("/addshare/:userId").post(addShare)

router.route("/getshares/:userId").get(getAllShares)



module.exports = router;