import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsManagementService } from 'src/app/shared/service/requests-management.service';
import { Request } from 'src/app/models/request.model';
import { RequestType } from 'src/app/models/enums/request-type.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  todayVisits: Request[] | undefined;
  weekVisits: Request[] | undefined;
  todayPasses: Request[] | undefined;
  weekPasses: Request[] | undefined;
  visitsRequests: Request[] | undefined;

  containers: {
    type: string;
    header: string;
    items: { today: Request[] | undefined; week: Request[] | undefined };
    buttonAction: () => Promise<void>;
  }[] = [];
  public showName = false;

  constructor(
    private requestsManagementService: RequestsManagementService,
    private router: Router,
  ) {
    this.fetchData();
  }

  fetchData(): void {
    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + 7);

    //requests
    this.requestsManagementService.getListOfRequests(0, 10).subscribe(
      (res: { data: Request[] | undefined }) => {
        if (res) {
          console.log(res);
          this.visitsRequests = res.data;
          this.updateContainers();
        }
      },
      error => {
        if (error.status === 403) {
          this.visitsRequests = undefined;
        }
      }
    );

    // visits
    this.requestsManagementService
      .getRequestsByDateForUser(
        todayDate,
        weekDate,
        RequestType.Visit,
        0,
        10
      )
      .subscribe(res => {
        if (res) {
          console.log(res);
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
      .getRequestsByDateForUser(
        todayDate,
        weekDate,
        RequestType.Pass,
        0,
        10
      )
      .subscribe(res => {
        if (res) {
          console.log(res);
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

  updateContainers(): void {
    this.containers = [
      {
        type: 'visits',
        header: 'Upcoming visits',
        items: { today: this.todayVisits, week: this.weekVisits },
        buttonAction: async () => {
          await this.router.navigate([`/dashboard`]);
        },
      },
      {
        type: 'passes',
        header: 'Upcoming passes',
        items: { today: this.todayPasses, week: this.weekPasses },
        buttonAction: async () => {
          await this.router.navigate([`/dashboard`]);
        },
      },
      {
        type: 'requests',
        header: 'Prisoners visit requests',
        items: { today: this.visitsRequests, week: [] },
        buttonAction: async () => {
          await this.router.navigate([`/dashboard`]);
        },
      },
    ];
  }

  categorizeAbsencesByDate(
    absences: Request[],
    tomorrowDate: Date,
    weekDate: Date
  ): { today: Request[]; week: Request[] } {
    const today: Request[] = [];
    const week: Request[] = [];

    absences.forEach(absence => {
      if (new Date(absence.from) === tomorrowDate) {
        today.push(absence);
      } else if (
        new Date(absence.from) <= weekDate &&
        !week.some(existingAbsence => existingAbsence.userId === absence.userId)
      ) {
        week.push(absence);
      }
    });
    return { today, week };
  }
  
}
