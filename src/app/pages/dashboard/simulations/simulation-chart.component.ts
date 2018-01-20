import { AfterViewInit, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
declare var moment: any;

@Component({
  selector: 'simulation-bar-chart',
  styleUrls: ['./simulation-chart.component.scss'],
  templateUrl: './simulation-chart.component.html',
})
export class EchartsBarComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  months: string[];
  dateSelection: string = '';
  hubs: string[] = [];
  traffic: number[] = [];
  capacity: number[] = [];

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  year: string;
  @Input() site: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
    this.months = [];
    this.year = '';
  }

  buildChart(){
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.hubs,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Forecasted Traffic',
            type: 'bar',
            barWidth: '30%',
            data: this.traffic
          },
          {
            name: 'Provisioned Capacity',
            type: 'bar',
            barWidth: '30%',
            data: this.capacity,
            itemStyle: {
              normal: {
                color: '#00f9a6'
              }
            }
          }
        ],
      };
    });
  }

  selectMonth(month){
    this.hubs = [];
    this.traffic = [];
    this.capacity = [];

    let simulation = this.site.simulation.filter(sim => {
      return sim.month === month;
    });

    for(let sim of simulation){
      for(let hub of sim.hubs){
        this.hubs.push(hub.hub_name);
        this.traffic.push(hub.forecasted_traffic);
        this.capacity.push(hub.provisioned_capacity);
      }
    }
    this.buildChart();
  };

  ngOnInit() {
    console.log(this.site);
    if(this.site.simulation.length > 0){
      for(let sim of this.site.simulation){
        this.months.push(sim.month);
      }
      this.year += (new Date(this.months[0]).getFullYear() + 1).toString();
      this.dateSelection = this.months[0];
      this.selectMonth(this.dateSelection);
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
