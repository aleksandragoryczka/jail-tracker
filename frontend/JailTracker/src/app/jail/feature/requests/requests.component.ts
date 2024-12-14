import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { PaginatedResult } from 'src/app/models/paginatedResult.model';
import {
  SharedTableData,
  SharedTableDataFunc,
} from 'src/app/models/shard-table-data.model';
import { RequestsService } from 'src/app/shared/service/requests.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Request } from 'src/app/models/request.model';
import { TooltipTexts } from 'src/app/models/enums/tooltips-types.enum';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupDataModel,
  InputPopupModel,
} from 'src/app/models/input-popup-data.model';
import { Dictionary } from 'src/app/models/dictionary.model';
import { ApprovalState } from 'src/app/models/enums/approval-state.enum';
import { PopupWithInputsComponent } from 'src/app/shared/ui/popup-with-inputs/popup-with-inputs.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent {
  currentPage$ = new BehaviorSubject<number>(0);
  currentPageHistory$ = new BehaviorSubject<number>(0);
  listOfRequests$: Observable<SharedTableData[]> = this.loadRequests();
  listOfRequestsHistory$: Observable<SharedTableData[]> =
    this.loadRequestsHistory();

  header = ['Name', 'Type', 'From', 'To', 'Actions'];
  headerHistory = [
    'Name',
    'Type',
    'From',
    'To',
    'Request State',
    'Change Status',
  ];
  totalNumberOfPages = 1;
  totalNumberOfPagesHistory = 1;
  requestTypeString: string[] = ['Visit', 'Pass'];
  requestStateString: string[] = ['Pending', 'Approved', 'Rejected'];
  permissionTypes = PermissionTypes;

  constructor(
    private userService: UserService,
    private requestsService: RequestsService,
    private dialog: MatDialog
  ) {}

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }

  setPageHistory(pageNumber: number): void {
    this.currentPageHistory$.next(pageNumber);
  }

  private loadRequests() {
    return this.currentPage$.pipe(
      switchMap((currentPage) =>
        this.requestsService.getListOfRequests(currentPage)
      ),
      map((res) => {
        this.totalNumberOfPages = res?.page ?? 1;
        if (res?.data.length === 0 && this.currentPage$.value - 1 >= 0)
          this.currentPage$.next(this.currentPage$.value - 1);
        return this.mapData(res);
      })
    );
  }

  private mapData(
    data: PaginatedResult<Request> | undefined
  ): SharedTableData[] {
    if (typeof data === 'undefined') return [];
    const requests = data.data;
    const results: SharedTableData[] = [];
    requests.forEach((request) => {
      const fromDate = new Date(request.from);
      const toDate = new Date(request.to);
      const result: SharedTableData = {
        cols: [
          request?.userFirstName?.toString() +
            ' ' +
            request?.userLastName?.toString(),
          this.requestTypeString[request.requestType],
          fromDate.getDay() +
            '/' +
            fromDate.getMonth() +
            '/' +
            fromDate.getFullYear(),
          toDate.getDay() +
            '/' +
            toDate.getMonth() +
            '/' +
            toDate.getFullYear(),
        ],
        actions: [
          {
            icon: 'done',
            func: (arg: string) => {
              this.openRequestApprovalPopup(arg);
            },
            arg: request.id,
            tooltip: TooltipTexts.acceptRequest,
          },
          {
            icon: 'close',
            func: (arg: string) => {
              this.openRequestDisapprovalPopup(arg);
            },
            arg: request.id,
            tooltip: TooltipTexts.cancelRequest,
          },
        ],
      };
      results.push(result);
    });
    return results;
  }

  private openRequestApprovalPopup(guid: string | undefined) {
    console.log(guid);
    if (typeof guid === 'undefined') return;
    const inputs: Dictionary<InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.requestApproval(guid),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'NO',
      },
    ];

    const data: InputPopupDataModel = {
      title: 'Approve request',
      description: 'Are you sure you want to approve request?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private requestApproval(requestId: string) {
    this.requestsService
      .approveRequest(requestId, ApprovalState.Approved)
      .subscribe(() => {
        this.listOfRequests$ = this.loadRequests();
        this.listOfRequestsHistory$ = this.loadRequestsHistory();
      });
  }

  private loadRequestsHistory() {
    return this.currentPageHistory$.pipe(
      switchMap((currentPage) =>
        this.requestsService.getListOfRequestsHistory(currentPage)
      ),
      map((res) => {
        this.totalNumberOfPagesHistory = res?.page ?? 1;
        if (res?.data.length === 0 && this.currentPageHistory$.value - 1 >= 0)
          this.currentPageHistory$.next(this.currentPageHistory$.value - 1);
        return this.mapDataHistory(res);
      })
    );
  }

  private mapDataHistory(
    data: PaginatedResult<Request> | undefined
  ): SharedTableData[] {
    if (typeof data === 'undefined') return [];
    const requests = data.data;
    const results: SharedTableData[] = [];
    requests.forEach((request) => {
      const fromDate = new Date(request.from);
      const toDate = new Date(request.to);
      const result: SharedTableData = {
        cols: [
          request?.userFirstName?.toString() +
            ' ' +
            request?.userLastName?.toString(),
          this.requestTypeString[request.requestType],
          fromDate.getDay() +
            '/' +
            fromDate.getMonth() +
            '/' +
            fromDate.getFullYear(),
          toDate.getDay() +
            '/' +
            toDate.getMonth() +
            '/' +
            toDate.getFullYear(),
          this.requestStateString[request.approvalState],
        ],
        actions: this.getActionChangeRequestState(request),
      };
      results.push(result);
    });
    return results;
  }

  private getActionChangeRequestState(request: Request): SharedTableDataFunc[] {
    if (request.approvalState === ApprovalState.Approved) {
      return [
        {
          icon: 'close',
          func: (arg: string) => {
            this.openRequestDisapprovalPopup(arg);
          },
          arg: request.id,
        },
      ];
    } else if (request.approvalState == ApprovalState.Rejected) {
      return [
        {
          icon: 'done',
          func: (arg: string) => {
            this.openRequestApprovalPopup(arg);
          },
          arg: request.id,
        },
      ];
    }
    return [];
  }

  private openRequestDisapprovalPopup(guid: string | undefined) {
    if (typeof guid === 'undefined') return;
    const inputs: Dictionary<InputPopupModel> = {};
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Yes',
        onClick: () => this.requestDisapproval(guid),
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'NO',
      },
    ];

    const data: InputPopupDataModel = {
      title: 'Disapprove request',
      description: 'Are you sure you want to disapprove request?',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private requestDisapproval(requestId: string) {
    this.requestsService
      .approveRequest(requestId, ApprovalState.Rejected)
      .subscribe(() => {
        this.listOfRequests$ = this.loadRequests();
        this.listOfRequestsHistory$ = this.loadRequestsHistory();
      });
  }
}
