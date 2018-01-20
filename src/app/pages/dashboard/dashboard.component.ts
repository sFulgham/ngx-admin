import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  sites: any;

  constructor(private http: HttpClient) {
    this.sites = this.getCategories();
  }

  getCategories() {
    let self = this;
    this.http.get('./assets/api/sites.json').subscribe(sites => {
      self.sites = sites;
    });
  }

  buildChart(idx){
    return '';
  }
}
