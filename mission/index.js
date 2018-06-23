/**
 * @fileOverview
 * @author iNahoo
 * @since 2018/6/22.
 */
"use strict";

const fs = require('fs');
const path = require('path');
const LOCAL_FILE_NAME = path.resolve(__dirname, '.missions');
const process = require('child_process');
const log = require('./log');

const Mission = require('./Mission');
const MSArray = require('./MissionList');

const isExist = p => {
  try {
    fs.statSync(p);
    return true;
  } catch (e) {
    return false;
  }
};

const getMSfromLocal = () => {
  const MSJSON = fs.readFileSync(LOCAL_FILE_NAME, 'utf-8');
  if (!MSJSON) return {};
  
  const MS = JSON.parse(MSJSON);
  for (let id in MS) {
    MS[id] = new Mission(JSON.parse(MS[id]));
  }
  return MS;
};

const syncMStoLocal = MS => {
  const j = {};
  for (let id in MS) {
    j[id] = MS[id].stringify();
  }
  const MSJSON = JSON.stringify(j);
  fs.writeFileSync(LOCAL_FILE_NAME, MSJSON, 'utf-8');
};

class Manager {
  constructor() {
    if (isExist(LOCAL_FILE_NAME)) {
      this.MS = getMSfromLocal();
    } else {
      this.MS = {};
    }
    this.merge();
    this.setInterval();
  }
  
  merge() {
    const idList = MSArray.map(v => v.id);
    for (let id in this.MS) {
      if (idList.indexOf(id) === -1) delete this.MS[id];
    }
    
    MSArray.forEach(M => {
      if (!(M.id in this.MS)) {
        this.MS[M.id] = M;
        console.log(this.MS);
      }
    });
    
    syncMStoLocal(this.MS);
  }
  
  setInterval() {
    setInterval(() => {
      const now = Date.now();
      for (let id in this.MS) {
        const M = this.MS[id];
        if (now > M.next) {
          try {
            process.exec(`node ${path.resolve(__dirname, M.target)}`);
            log(`run ${M.target} At ${new Date(now).toString()}`);
          } catch (e) {
            log(e);
          }
  
          const lastTS = M.next.getTime();
          const next = Math.ceil((now - lastTS) / M.interval) * M.interval;
          M.next = new Date(next);
          syncMStoLocal(this.MS);
        }
      }
    }, 100 * 1e3)
  }
  
}

new Manager();
