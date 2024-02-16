const express = require('express');
const router = express.Router();
const app = express()

//Controllers
const blogController = require("../controllers/blogController")

router.get("/" , blogController.home)

module.exports = router