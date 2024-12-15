import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { map, Observable } from 'rxjs';
import { TimeUtilities } from 'src/app/shared/web-utilities/time-utilities';
import { RequestsManagementService } from '../../../shared/service/requests-management.service';
import { RequestType } from 'src/app/models/enums/request.enum';
import { colors } from 'src/app/models/colors/color';
import { Request } from 'src/app/models/request.model';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { isSameDay, isSameMonth } from 'date-fns';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<unknown>;
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen = false;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  from: Date = TimeUtilities.getFirstDayOfMonth(new Date());
  to: Date = TimeUtilities.getLastDayOfMonth(new Date());
  events: Observable<CalendarEvent<string>[]> = this.loadEvents();
  diffInMonths = 0;

  constructor(private requestManagementService: RequestsManagementService) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (!isSameMonth(date, this.viewDate)) return;
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    )
      this.activeDayIsOpen = false;
    else this.activeDayIsOpen = true;

    this.viewDate = date;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  presentMonth() {
    this.diffInMonths = 0;
    this.from = TimeUtilities.getFirstDayOfMonth(new Date());
    this.to = TimeUtilities.getLastDayOfMonth(new Date());
    this.events = this.loadEvents();
  }

  nextMonth() {
    this.diffInMonths--;
    this.from = TimeUtilities.getFirstDayOfMonth(
      TimeUtilities.getDateDifferentByMonths(this.diffInMonths)
    );
    this.to = TimeUtilities.getLastDayOfMonth(
      TimeUtilities.getDateDifferentByMonths(this.diffInMonths)
    );
    this.events = this.loadEvents();
  }

  prevMonth() {
    this.diffInMonths++;
    this.from = TimeUtilities.getFirstDayOfMonth(
      TimeUtilities.getDateDifferentByMonths(this.diffInMonths)
    );
    this.to = TimeUtilities.getLastDayOfMonth(
      TimeUtilities.getDateDifferentByMonths(this.diffInMonths)
    );
    this.events = this.loadEvents();
  }

  private loadEvents(): Observable<CalendarEvent[]> {
    return this.requestManagementService
      .getEventsMonthly(this.from, this.to)
      .pipe(map((res) => this.mapData(res)));
  }

  private mapData(data: Request[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    data.forEach((request) => {
      const event: CalendarEvent = {
        start: new Date(request.from),
        end: new Date(request.to),
        title: `${request.userFirstName} ${
          request.userLastName
        } - ${this.getAbsenceTypeTitle(
          request.requestType
        )} - ${this.getApprovalStateString(request)}`,
        color: this.getAbsenceTypeColor(request.requestType),
        meta: this.getInitials(request),
        cssClass: this.getCssStyle(request),
      };
      events.push(event);
    });
    return events;
  }

  private getAbsenceTypeTitle(requestType: RequestType): string {
    const requestTypeStrings = ['Visit', 'Pass'];
    return requestTypeStrings[requestType];
  }

  private getAbsenceTypeColor(requestType: RequestType): EventColor {
    const requestTypeStrings = ['orange', 'blue', 'beige', 'beige'];
    return { ...colors[requestTypeStrings[requestType]] };
  }

  private getInitials(request: Request): string {
    let res = '';
    if (request?.userFirstName != null && request.userFirstName.length > 0)
      res += request.userFirstName[0];
    if (request?.userLastName != null && request.userLastName.length > 0)
      res += request.userLastName[0];

    return res;
  }

  private getApprovalStateString(request: Request): string {
    const requestStateString = ['Pending', 'Approved', 'Rejected'];
    return requestStateString[request.approvalState];
  }

  private getCssStyle(request: Request): string | undefined {
    if (request.approvalState === ApprovalState.Approved) return 'approved';
    else if (request.approvalState === ApprovalState.Rejected)
      return 'rejected';
    return undefined;
  }
}
