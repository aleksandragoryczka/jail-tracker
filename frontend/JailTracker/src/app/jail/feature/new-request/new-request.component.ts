import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take } from 'rxjs';
import { SharedTableData } from 'src/app/models/shard-table-data.model';
import { User } from 'src/app/models/user.model';
import { Request } from 'src/app/models/request.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Dictionary } from 'src/app/models/dictionary.model';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupDataModel,
  InputPopupModel,
} from 'src/app/models/input-popup-data.model';
import { RequestType } from 'src/app/models/enums/request.enum';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import { formatDate } from '@angular/common';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { TooltipTexts } from 'src/app/models/enums/tooltips-types.enum';
import { RequestsManagementService } from '../../../shared/service/requests-management.service';
import { PopupWithInputsComponent } from 'src/app/shared/ui/popup-with-inputs/popup-with-inputs.component';
import { UpdateRequest } from 'src/app/models/update-request.model';
import { TimeUtilities } from 'src/app/shared/web-utilities/time-utilities';
import { RequestsService } from '../../../shared/service/requests.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
})
export class NewRequestComponent {
  header = ['From date', 'To date', 'Type', 'Status', 'Supervisor', 'Actions'];
  currentPage$ = new BehaviorSubject<number>(0);
  listOfUserRequests$: Observable<SharedTableData[]> = this.loadUserRequests();
  totalNumberOfPages = 1;
  requestsYearCountInHours$ = this.getRequestsYearCountInHours();
  listOfSupervisors: User[] = [];
  Request: Request | undefined;

  constructor(
    private dialog: MatDialog,
    private requestsManagementService: RequestsManagementService,
    private tostr: ToastrService,
    private requestsService: RequestsService
  ) {}

  // TODO: Open date popup -> change from only date -> to date with time (from date/ to date)

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  openNewRequestPopupSelectRequestType(): void {
    const inputs: Dictionary<InputPopupModel> = {
      ['RequestOptions']: {
        value: '',
        type: 'select',
        placeholder: 'Select type of Event',
        selectOptions: Object.keys(RequestType)
          .filter((key) => isNaN(Number(key)))
          .map((key) => ({
            value: key,
            displayValue: key.replace(/([A-Z])/g, ' $1').trim(),
          })),
      },
    };

    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
      {
        type: ButtonTypes.PRIMARY,
        text: 'Continue',
        onClick: () =>
          this.openNewRequestPopupSelectDatesRange(
            RequestType[
              inputs['RequestOptions'].value as keyof typeof RequestType
            ]
          ),
      },
    ];

    const data: InputPopupDataModel = {
      title: 'New request',
      description: 'Fill basic data about your request:',
      inputs: inputs,
      buttons: buttons,
    };

    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private openNewRequestPopupSelectDatesRange(requestType: RequestType): void {
    const inputs: Dictionary<InputPopupModel> = {};
    if (requestType == RequestType.Pass) {
      inputs['RequestBeginningDate'] = {
        value: '',
        type: 'date',
        placeholder: 'Enter beginning date:',
      };
      inputs['RequestEndDate'] = {
        value: '',
        type: 'date',
        placeholder: 'Enter end date:',
      };
    } else if (requestType == RequestType.Visit) {
      inputs['RequestDate'] = {
        value: '',
        type: 'date',
        placeholder: 'Enter visit date:',
      };
      inputs['RequestBeginningTime'] = {
        value: '',
        type: 'time',
        placeholder: 'Enter beginning time:',
      };
      inputs['RequestEndTime'] = {
        value: '',
        type: 'time',
        placeholder: 'Enter end time:',
      };
    }

    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
      {
        type: ButtonTypes.PRIMARY,
        text: 'Submit',
        onClick: () => this.createTimeOffRequest(requestType, inputs),
      },
    ];

    const data: InputPopupDataModel = {
      title: 'New request',
      description: 'Fill basic data about your request:',
      inputs: inputs,
      buttons: buttons,
    };

    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private createTimeOffRequest(
    requestType: RequestType,
    inputs: Dictionary<InputPopupModel>
  ): void {
    const userRequest: Request = {
      requestType: requestType,
      approvalState: ApprovalState.Pending,
      from: new Date(),
      to: new Date(),
    };
    if (requestType == RequestType.Pass) {
      userRequest.from = new Date(String(inputs['RequestBeginningDate'].value));
      userRequest.to = TimeUtilities.createDateAsUTC(
        new Date(String(inputs['RequestEndDate'].value))
      );
    } else if (requestType == RequestType.Visit) {
      userRequest.from = TimeUtilities.combineDateAndTime(
        String(inputs['RequestDate'].value),
        String(inputs['RequestBeginningTime'].value)
      );
      userRequest.to = TimeUtilities.combineDateAndTime(
        String(inputs['RequestDate'].value),
        String(inputs['RequestEndTime'].value)
      );
    }

    this.requestsService.createRequest(userRequest).subscribe((isSuccess) => {
      if (isSuccess) {
        this.tostr.success('New Request created successfully');
      } else {
        this.tostr.success('Something went wrong');
      }
      this.listOfUserRequests$ = this.loadUserRequests();
    });
  }

  private loadUserRequests(): Observable<SharedTableData[]> {
    return this.currentPage$.pipe(
      switchMap((currentPage) =>
        this.requestsManagementService.getRequestsForUser(currentPage)
      ),
      map((res: PaginatedResult<Request>) => {
        this.totalNumberOfPages = res.page ?? 1;
        if (res.data.length === 0 && this.currentPage$.value - 1 >= 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return this.mapData(res);
      })
    );
  }

  private mapData(data: PaginatedResult<Request>): SharedTableData[] {
    const userRequests = data.data;
    const results: SharedTableData[] = [];
    userRequests.forEach((userRequest) => {
      if (
        typeof userRequest.from !== 'undefined' &&
        typeof userRequest.to !== 'undefined' &&
        typeof userRequest.requestType !== 'undefined'
      ) {
        const result: SharedTableData = {
          cols: [
            formatDate(userRequest.from, 'dd/MM/yyyy', 'en-US'),
            formatDate(userRequest.to, 'dd/MM/yyyy', 'en-US'),
            RequestType[Number(userRequest.requestType.toString())].replace(
              /([A-Z])/g,
              ' $1'
            ),
            ApprovalState[Number(userRequest.approvalState?.toString())],
            this.getSupervisorName(userRequest),
          ],
          actions: [],
        };

        if (new Date(userRequest.from) > new Date()) {
          result.actions?.push({
            icon: 'delete',
            func: (arg: string) => {
              this.openCancelRequestPopup(arg);
            },
            arg: userRequest.id,
            tooltip: TooltipTexts.cancelRequest,
          });
        }
        if (
          ApprovalState[Number(userRequest.approvalState?.toString())] ==
          'Pending'
        ) {
          result.actions?.push({
            icon: 'launch',
            func: (arg: Request) => {
              this.openUpdateRequestPopup(arg);
            },
            arg: userRequest,
            tooltip: TooltipTexts.requestDetails,
          });
        }
        results.push(result);
      }
    });
    return results;
  }

  private getSupervisorName(userRequest: Request): string {
    const name = userRequest?.supervisorFirstName ?? '';
    const lastName = userRequest?.supervisorLastName ?? '';
    const fullName = name + ' ' + lastName;
    return fullName;
  }

  openCancelRequestPopup(requestId: string): void {
    const inputs: Dictionary<InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.cancelRequest(requestId),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'NO',
      },
    ];

    const data: InputPopupDataModel = {
      title: 'Cancel request',
      description: 'Are you sure you want to cancel your request?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  cancelRequest(requestId: string): void {
    this.requestsManagementService
      .cancelRequest(requestId)
      .subscribe((isCancelled) => {
        if (isCancelled) {
          this.tostr.success('Time Off request cancelled successfully');
        } else {
          this.tostr.warning('Something went wrong');
        }
        this.listOfUserRequests$ = this.loadUserRequests();
      });
  }

  private openUpdateRequestPopup(userRequest: Request): void {
    if (typeof userRequest.requestType !== 'undefined') {
      const inputs: Dictionary<InputPopupModel> = {};
      if (userRequest.requestType == RequestType.Pass) {
        inputs['RequestfBeginningDate'] = {
          value: userRequest.from,
          type: 'date',
          placeholder: 'Current beginning date:',
        };
        inputs['RequestEndDate'] = {
          value: userRequest.to,
          type: 'date',
          placeholder: 'Current end date:',
        };
      } else if (userRequest.requestType == RequestType.Visit) {
        console.log(userRequest.from);
        inputs['RequestDate'] = {
          value: userRequest.from,
          type: 'date',
          placeholder: 'Current visit date:',
        };
        inputs['RequestBeginningTime'] = {
          value: TimeUtilities.getTimeFromDate(userRequest.from),
          type: 'time',
          placeholder: 'Current beginning time:',
        };
        inputs['RequestEndTime'] = {
          value: TimeUtilities.getTimeFromDate(userRequest.to),
          type: 'time',
          placeholder: 'Current end time:',
        };
      }

      const buttons: ButtonPopupModel[] = [
        {
          type: ButtonTypes.PRIMARY,
          text: 'Update',
          onClick: () => this.updateRequest(inputs, userRequest),
        },
      ];

      const data: InputPopupDataModel = {
        title: 'Update your Pending Request details',
        description:
          "Update fields if you want to change your request's details. If you want to change type of request, please cancel it and create new one.",
        inputs: inputs,
        buttons: buttons,
      };

      this.dialog.open(PopupWithInputsComponent, {
        data: data,
        panelClass: 'jail-tracker-popup',
      });
    }
  }

  private updateRequest(inputs: Dictionary<InputPopupModel>, request: Request) {
    const updatedRequest: UpdateRequest = {};

    this.requestsManagementService.request$
      .pipe(
        map((request) => request?.id),
        switchMap((id) => {
          updatedRequest.requestId = request.id;
          if (request.requestType == RequestType.Pass) {
            updatedRequest.newFromDate = TimeUtilities.createDateAsUTC(
              new Date(String(inputs['RequestBeginningDate'].value))
            );
            updatedRequest.newToDate = TimeUtilities.createDateAsUTC(
              new Date(String(inputs['RequestEndDate'].value))
            );
          } else if (request.requestType == RequestType.Visit) {
            updatedRequest.newFromDate = TimeUtilities.combineDateAndTime(
              String(inputs['RequestDate'].value),
              String(inputs['RequestBeginningTime'].value)
            );
            updatedRequest.newToDate = TimeUtilities.combineDateAndTime(
              String(inputs['RequestDate'].value),
              String(inputs['RequestEndTime'].value)
            );
          }
          updatedRequest.newRequestType = request.requestType;
          return this.requestsManagementService.updateRequest(updatedRequest);
        }),
        take(1)
      )
      .subscribe((updatedRequest: any) => {
        if (updatedRequest) {
          this.tostr.success('Request successfully updated');
        } else {
          this.tostr.warning('Something went wrong');
        }
        this.listOfUserRequests$ = this.loadUserRequests();
      });
  }

  private getRequestsYearCountInHours(): Observable<number> {
    return this.requestsManagementService.getYearAbsenceCountForUserInHours();
  }
}
