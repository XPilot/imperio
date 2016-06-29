"use strict"; // eslint-disable-line
const jwtController = require('./jwtController.js');
const nonceController = require('./nonceController.js');
const path = require('path');

const desktopController = {};

desktopController.handleRequest = function(connectRequests) {
  return (req, res, next) => {
    // Only execute this func if we're accessing it from a desktop
    if (req.useragent && req.useragent.isDesktop) {
      console.log(`request is from Desktop`);
      // check if already in session, or create session
      const roomId = jwtController.handleSession(req, res);
      res.cookie('roomId', roomId); // DEBUG this is for reference?
      // handle nonce
      const nonce = nonceController.generateNonce(5);
      res.cookie('nonce', nonce);
      connectRequests[nonce] = nonceController.generateConnectRequest(roomId);
      console.log(connectRequests);
    }
    next();
  };
};

module.exports = desktopController;