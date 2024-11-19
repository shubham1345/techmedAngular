import { I } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root', // Just do @Injectable() if you're not on Angular v6+
})
export class UtilsService {
  constructor() {}

  public monthDiff(d1, d2): boolean {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffInMs = date1.valueOf() - date2.valueOf();
    const diffInds = diffInMs / (1000 * 60 * 60 * 24);
    // console.log(diffInds);
    if (diffInds > 89) {
      return true;
    } else {
      return false;
    }
  }
  public monthDiffInDay(d1, d2): number {
    const date1:any = new Date(d1);
    const date2:any = new Date(d2);
    // const diffTime = Math.abs(date2 - date1);
    // const diffInds:any = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const diffInMs = date1.valueOf() - date2.valueOf();
    const diffInds:any= diffInMs / (1000 * 60 * 60 * 24);
    if(diffInds>-1&&diffInds<0)
    {
      return 0;
    }
    return parseInt(diffInds);
  }
  public weekDiff(d1, d2): boolean {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffInMs = date1.valueOf() - date2.valueOf();
    const diffInds = diffInMs / (1000 * 60 * 60 * 24);
    // console.log(diffInds);
    if (diffInds > 6) {
      return true;
    } else {
      return false;
    }
  }
  SubtractMonths(numOfMonths:number, date = new Date()) {
    date.setMonth(date.getMonth() - numOfMonths);
    return date;
  }
}
