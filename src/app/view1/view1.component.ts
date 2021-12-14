import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { Select, Store } from '@ngxs/store';
import { plainToClass } from 'class-transformer';
import { AuthenticationService, AuthenticationState } from 'libs/core/src';
import { Observable } from 'rxjs';
import { UserSettings, UserSettingsCls } from 'src/app/all-models/etc.model';
import { DashboardPanelModel } from 'src/app/all-models/sv-dashboard';
@Component({
  selector: 'app-view1',
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.css']
})
export class View1Component implements OnInit {

  public readonly DASHBOARD_KEY = "svDashboard";
  private apiUrl: string;
  private userSettingsUrl;
  constructor(private store: Store,
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthenticationService
  ) {
    this.apiUrl = this.configService.getSettings('apiBaseUrl');
    this.userSettingsUrl = this.configService.getSettings('userSettingsService');
  }
  @Select(AuthenticationState.getActiveplant) activePlants: Observable<any>;

  plantList =[];
  ngOnInit() {
    
  }
  dashboardData;
  isLoading;
  async getDashboardData() {
    this.isLoading = true;
    let settings = await this.getUserSettings(this.DASHBOARD_KEY).toPromise().catch(() => {
      settings = undefined;
    });
    settings = plainToClass(UserSettingsCls, settings);
    if (settings && settings.key) {
      //this.dashboardAlreadySaved = true;
      this.dashboardData = plainToClass(DashboardPanelModel, JSON.parse(settings.data) as DashboardPanelModel[]);
    }
    else {

      //this.data = plainToClass(DashboardPanelModel, this.supplyVisibilityService.SVDefaultDashboard);
    }
    this.assignIdIfMissing(this.dashboardData);
    for (let index = 0; index < this.dashboardData.length; index++) {
      const element = this.dashboardData[index];
    }
    this.isLoading = false;

  }
  assignIdIfMissing(data: DashboardPanelModel[]) {
    for (let index = 0; index < data.length; index++) {
      DashboardPanelModel.assignIdIfMissing(data[index]);
    }
  }
  getUserSettings(
    dashboard: string
  ): Observable<any> {
    const plant = this.store.selectSnapshot(AuthenticationState.getActiveplant);
    return this.http.get<UserSettings>(`${this.getApiUrlUserSettings('')}${dashboard}-${plant}`, {});
  }
  getApiUrlUserSettings(action: string) {
    console.log(this.userSettingsUrl);
    return `${this.userSettingsUrl}${this.configService.getSettings(
      'modulesBaseUrl.materialManagement.userSettings'
    )}/${action}`;
  }

  renewToken(){
    // this.authService.oi
  }
}
