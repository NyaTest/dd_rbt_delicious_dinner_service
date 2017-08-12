#!/usr/bin/env node

import app = require('../app');
import loadService = require('../service');

loadService(app);

app.listen(30000);

