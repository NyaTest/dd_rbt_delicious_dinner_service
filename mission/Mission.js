/**
 * @fileOverview
 * @author iNahoo
 * @since 2018/6/22.
 */
"use strict";

class Mission {
  constructor({id, description, interval, first, target, next = 0}) {
    this.id = id;
    this.description = description;
    this.interval = interval;
    this.target = target;
    
    this.next = new Date(next || first);
    this.first = first;
  }
  
  stringify() {
    const {id, description, interval, first, target, next} = this;
    return JSON.stringify({id, description, interval, first, target, next: next.getTime()});
  }
  
}

module.exports = Mission;