#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app = require("../app");
const loadService = require("../service");
loadService(app);
app.listen(30000);
//# sourceMappingURL=entry.js.map