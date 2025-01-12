import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { Dictionary } from 'cypress/types/lodash';
import { PopupWithInputsComponent } from 'src/app/shared/ui/popup-with-inputs/popup-with-inputs.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ButtonPopupModel,
  ButtonTypes,
  InputPopupDataModel,
  InputPopupModel,
} from 'src/app/models/input-popup-data.model';
import { ProfilePopupComponent } from './profile-popup/profile-popup.component';
import { UpdateUserDto } from 'src/app/models/update-user.model';
import { UserService } from 'src/app/shared/service/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  photoPath = 'assets/images/default-avatar.png';
  profileForm: FormGroup;
  public showHover = true;
  user: User | undefined;
  userID: string | undefined;
  supervisor: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {
    this.profileForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.userService.user$.subscribe((res) => {
      if (res) {
        this.userID = res.id;
      }
    });
    if (this.userID) {
      this.userService.getUser(this.userID).subscribe((res) => {
        this.user = res;
        if (this.user?.currentRequestsSupervisorId) {
          this.userService
            .getUser(this.user.currentRequestsSupervisorId)
            .subscribe((res) => {
              this.supervisor = res.firstName + ' ' + res.lastName;
            });
        }
      });
    }
  }

  openChangeNamePopup(): void {
    const inputs: Dictionary<InputPopupModel> = {
      ['firstName']: {
        value: this.user?.firstName,
        type: 'text',
        placeholder: 'Name',
      },
      ['lastName']: {
        value: this.user?.lastName,
        type: 'text',
        placeholder: 'Surname',
      },
    };
    const buttons: ButtonPopupModel[] = [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Edit',
        onClick: () => this.updateUser(inputs),
      },

      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
        onClick: () => this.dialog.closeAll(),
      },
    ];
    const data: InputPopupDataModel = {
      title: 'Change profile',
      description: '',
      inputs: inputs,
      buttons: buttons,
    };
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  openChangePasswordPopup(): void {
    this.dialog.open(ProfilePopupComponent, {
      data: { userId: this.userID },
    });
  }

  updateUser(inputs: Dictionary<InputPopupModel>): void {
    const updateUserDto: UpdateUserDto = {
      firstName: String(inputs['firstName'].value),
      lastName: String(inputs['lastName'].value),
      password: '',
      currentPassword: '',
    };

    if (this.userID) {
      this.userService.updateUser(updateUserDto).subscribe({
        next: () => {
          this.dialog.closeAll(),
          this.toastrService.success('Successfully updated profile.');
          setTimeout(() => {
            location.reload();
          }, 4500);
        },
      });
    }
  }
}
