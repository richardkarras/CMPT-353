"use strict";

const express = require('express');
let router = express.Router();

module.exports = router;

router.use((req, res, next) => {
    console.log(req.url, Date.now());
    next();
});

router.route('/scifi')
.get((req, res, next) => { res.send('<h1> SCIFI </h1>'); })
.post((req, res, next) => { });

router.route('/scifi/:bookid')
.get((req, res, next) => { res.send(`<h1> SCIFI ${req.params.bookid} </h1>`);})
.put((req, res, next) => {});