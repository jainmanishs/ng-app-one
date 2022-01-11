import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@ngx-config/core';
import { Store } from '@ngxs/store';
import { plainToClass } from 'class-transformer';
import { AuthenticationService, AuthenticationState } from 'libs/core/src';
import { Observable } from 'rxjs';
import { UserSettings, UserSettingsCls } from 'src/app/all-models/etc.model';
import { DashboardPanelModel } from 'src/app/all-models/sv-dashboard';
import { HeaderBreadcrumb } from 'src/app/shared/models/common-models';

@Component({
  selector: 'app-view2',
  templateUrl: './view2.component.html',
  styleUrls: ['./view2.component.css']
})
export class View2Component implements OnInit {
  public readonly DASHBOARD_KEY = "svDashboard";
  private apiUrl: string;
  private userSettingsUrl;
  constructor(private store:Store,
    private http: HttpClient,
    private configService: ConfigService,
    private authService:AuthenticationService
    ) { this.apiUrl = this.configService.getSettings('apiBaseUrl');
    this.userSettingsUrl = this.configService.getSettings('userSettingsService'); }

  ngOnInit() {
  }
  data;
   async testApiCall() {
    
    let settings = await this.getUserSettings(this.DASHBOARD_KEY).toPromise().catch(() => {
      settings = undefined;
    });
    settings = plainToClass(UserSettingsCls, settings);
    if (settings && settings.key) {
      //this.dashboardAlreadySaved = true;
      this.data = plainToClass(DashboardPanelModel, JSON.parse(settings.data) as DashboardPanelModel[]);
    }
    else {
      
      //this.data = plainToClass(DashboardPanelModel, this.supplyVisibilityService.SVDefaultDashboard);
    }
    this.assignIdIfMissing(this.data);
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
    }
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
  getHeaderBreadcrumbs(): HeaderBreadcrumb[] {
    const headerBreadcrumbs: HeaderBreadcrumb[] = [
      {
        navigateTitle: "Main App",
        navigateUrl: "/dashboard"
      },
      {
        navigateTitle: "App 1",
        navigateUrl: "/app1"
      }
    ]

    return headerBreadcrumbs;
  }
}

