import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss'],
})
export class NewRequestComponent implements OnInit {
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
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  openNewRequestPopup(): void {
    const inputs: Dictionary<InputPopupModel> = {
      ['RequestBeginningDate']: {
        value: '',
        type: 'date',
        placeholder: 'Enter beginning date',
      },
      ['RequestEndDate']: {
        value: '',
        type: 'date',
        placeholder: 'Enter end date',
      },
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
      ['SupervisorsOptions']: {
        value: '',
        type: 'select',
        placeholder: 'Select approver',
        selectOptions: this.listOfSupervisors.map((supervisor) => ({
          value: supervisor.id ?? '',
          displayValue: `${supervisor.firstName} ${supervisor.lastName}`,
        })),
      },
    };
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
      const inputs: Dictionary<InputPopupModel> = {
        ['RequestfBeginningDate']: {
          value: userRequest.from,
          type: 'date',
          placeholder: 'Current beginning date:',
        },
        ['RequestEndDate']: {
          value: userRequest.to,
          type: 'date',
          placeholder: 'Current end date:',
        },
        ['RequestOptions']: {
          value: RequestType[userRequest.requestType],
          type: 'select',
          placeholder: RequestType[userRequest.requestType]
            .replace(/([A-Z])/g, ' $1')
            .trim(),
          selectOptions: Object.keys(RequestType)
            .filter((key) => isNaN(Number(key)))
            .map((key) => ({
              value: key,
              displayValue: key.replace(/([A-Z])/g, ' $1').trim(),
            })),
        },
        ['SupervisorsOptions']: {
          value: userRequest.requestSupervisorId,
          type: 'select',
          placeholder: `${userRequest.supervisorFirstName} ${userRequest.supervisorLastName}`,
          selectOptions: this.listOfSupervisors.map((supervisor) => ({
            value: supervisor.id ?? '',
            displayValue: `${supervisor.firstName} ${supervisor.lastName}`,
          })),
        },
      };

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
          "Update fields if you want to change your request's details: ",
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
          updatedRequest.newFromDate = TimeUtilities.createDateAsUTC(
            new Date(String(inputs['TimeOffBeginningDate'].value))
          );
          updatedRequest.newToDate = TimeUtilities.createDateAsUTC(
            new Date(String(inputs['TimeOffEndDate'].value))
          );
          updatedRequest.newRequestType =
            RequestType[
              inputs['RequestOptions'].value as keyof typeof RequestType
            ];
          updatedRequest.newRequestSupervisorId =
            inputs['SupervisorsOptions'].value?.toString();
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
