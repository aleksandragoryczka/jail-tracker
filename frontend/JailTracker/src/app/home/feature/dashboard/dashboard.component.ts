import { Component, ViewChild } from '@angular/core';
import { RequestsManagementService } from 'src/app/shared/service/requests-management.service';
import { Request } from 'src/app/models/request.model';
import { RequestType } from 'src/app/models/enums/request-type.enum';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { TimeUtilities } from 'src/app/shared/web-utilities/time-utilities';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { UserService } from 'src/app/shared/service/user.service';
import { Roles } from 'src/app/models/enums/roles.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  todayVisits: Request[] | undefined;
  weekVisits: Request[] | undefined;
  todayPasses: Request[] | undefined;
  weekPasses: Request[] | undefined;
  visitsRequests: Request[] | undefined;
  roles = Roles;

  containers: {
    type: string;
    header: string;
    items: { today: Request[] | undefined; week: Request[] | undefined };
    buttonAction: () => Promise<void>;
  }[] = [];
  public showName = false;

  constructor(
    private requestsManagementService: RequestsManagementService,
    private userService: UserService
  ) {
    this.fetchData();
  }

  showRequestType: 0 | 1 = 0;

  toggleRequestType() {
    this.showRequestType = this.showRequestType === 0 ? 1 : 0;
  }

  filterItemsByRequestType(items: any[]) {
    return items.filter((item) => item.requestType === this.showRequestType);
  }

  fetchData(): void {
    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + 7);

    //requests
    if (this.userService.isSupervisor()) {
      this.requestsManagementService.getListOfRequests(0, 10).subscribe(
        (res: { data: Request[] | undefined }) => {
          console.log(res);
          if (res) {
            this.visitsRequests = res.data;
            this.updateContainers();
          }
        },
        (error) => {
          if (error.status === 403) {
            this.visitsRequests = undefined;
          }
        }
      );
    }

    // visits
    this.requestsManagementService
      .getRequestsByDateForUser(todayDate, weekDate, RequestType.Visit, 0, 10)
      .subscribe(async (res) => {
        if (res) {
          const { today, week } = this.categorizeAbsencesByDate(
            res.data,
            todayDate,
            weekDate
          );
          this.todayVisits = today;
          this.weekVisits = week;
          this.updateContainers();
        }
      });

    // passes
    this.requestsManagementService
      .getRequestsByDateForUser(todayDate, weekDate, RequestType.Pass, 0, 10)
      .subscribe((res) => {
        if (res) {
          const { today, week } = this.categorizeAbsencesByDate(
            res.data,
            todayDate,
            weekDate
          );
          this.todayPasses = today;
          this.weekPasses = week;
          this.updateContainers();
        }
      });
  }

  getApprovalStateText(state: ApprovalState): string {
    switch (state) {
      case ApprovalState.Pending:
        return 'Pending';
      case ApprovalState.Approved:
        return 'Approved';
      case ApprovalState.Rejected:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getRequestTypeText(type: RequestType): string {
    switch (type) {
      case RequestType.Visit:
        return 'Visit';
      case RequestType.Pass:
        return 'Pass';
      default:
        return 'Unknown';
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  }

  updateContainers(): void {
    this.containers = [
      {
        type: 'visits',
        header: 'Upcoming visits',
        items: { today: this.todayVisits, week: this.weekVisits },
        buttonAction: async () => {},
      },
      {
        type: 'passes',
        header: 'Upcoming passes',
        items: { today: this.todayPasses, week: this.weekPasses },
        buttonAction: async () => {},
      },
    ];

    if (this.userService.isSupervisor()) {
      this.containers.push({
        type: 'requests',
        header: 'Pending prisoners requests',
        items: { today: this.visitsRequests, week: [] },
        buttonAction: async () => {},
      });
    }
  }

  categorizeAbsencesByDate(
    absences: Request[],
    todayDate: Date,
    weekDate: Date
  ): { today: Request[]; week: Request[] } {
    const today: Request[] = [];
    const week: Request[] = [];
    var formattedTodayDate = TimeUtilities.getDayMonthYearFromDate(todayDate);
    var formattedWeekDate = TimeUtilities.getDayMonthYearFromDate(weekDate);
    absences.forEach((absence) => {
      var formattedFromDate = TimeUtilities.getDayMonthYearFromDate(
        absence.fromDate
      );
      if (formattedFromDate.valueOf() === formattedTodayDate.valueOf()) {
        today.push(absence);
      } else if (
        formattedFromDate.valueOf() <= formattedWeekDate.valueOf() &&
        formattedFromDate.valueOf() > formattedTodayDate.valueOf()
      ) {
        week.push(absence);
      }
    });
    return { today, week };
  }
}
