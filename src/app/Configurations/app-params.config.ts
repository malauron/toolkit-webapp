import { DOCUMENT, Location, LocationStrategy } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppParamsConfig {
  url: any;
  urlV1: any;

  waitTime: number;
  pageSize: number;

  editItem: true;
  editMenu: true;

  constructor() {

    this.url = `${location.protocol}//${location.hostname}:8443/api`;
    this.urlV1 = `${this.url}/v1`;

    this.waitTime = 500;
    this.pageSize = 20;
  }
}
