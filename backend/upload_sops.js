const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// We need to run parseInventoryDocument but wait, we need to compile TS to JS, or run via ts-node.
// Easier way: write the string to sops.txt, then just use a shell script or write to sops.txt and tell user to upload it.
