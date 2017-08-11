#!/usr/bin/env node

import app = require('../app');
import loadService = require('../service');
import request = require('request-promise');

loadService(app);

app.listen(30000);

