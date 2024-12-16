import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from 'src/app/models/dictionary.model';
import {
  InputPopupDataModel,
  InputPopupModel,
  ButtonPopupModel,
  ButtonTypes,
  SelectOptionPopupModel
} from 'src/app/models/input-popup-data.model';
import { PopupWithInputsComponent } from 'src/app/shared/ui/popup-with-inputs/popup-with-inputs.component';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
  constructor(private dialog: MatDialog) {}

  handleAction(actionType: string) {
    switch (actionType) {
      case 'add-user':
        this.openPopup({
          title: 'Add User',
          description: 'Fill in the details to add a new user.',
          inputs: this.getAddUserInputs(),
          buttons: this.getActionButtons(() => this.addUser()),
        });
        break;
      case 'delete-user':
        this.openPopup({
          title: 'Delete User',
          description: 'Choose user to remove.',
          inputs: this.getDeleteUserInputs(),
          buttons: this.getActionButtons(() => this.deleteUser()),
        });
        break;
      case 'reset-password':
        this.openPopup({
          title: 'Reset User Password',
          description: 'Enter the username and new password.',
          inputs: this.getResetPasswordInputs(),
          buttons: this.getActionButtons(() => this.resetUserPassword()),
        });
        break;
      case 'grant-permissions':
        this.openPopup({
          title: 'Grant Permissions',
          description: 'Select the user and permissions to assign.',
          inputs: this.getGrantPermissionsInputs(),
          buttons: this.getActionButtons(() => this.grantPermissions()),
        });
        break;
      default:
        console.error('Invalid action type');
    }
  }

  private openPopup(data: InputPopupDataModel) {
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private getActionButtons(onConfirm: () => void): ButtonPopupModel[] {
    return [
      {
        type: ButtonTypes.PRIMARY,
        text: 'Confirm',
        onClick: onConfirm,
      },
      {
        type: ButtonTypes.SECONDARY,
        text: 'Cancel',
      },
    ];
  }

  private getChooseRoleSelect(): SelectOptionPopupModel[] {
    return [
      { value: 'prisoner', displayValue: 'Prisoner' },
      { value: 'guard', displayValue: 'Guard' },
    ];
  }

  private getAllUsersSelect(): SelectOptionPopupModel[] {
    return [
      { value: 'user1', displayValue: 'User 1' },
      { value: 'user2', displayValue: 'User 1' },
    ];
  }

  private getAddUserInputs(): Dictionary<InputPopupModel> {
    return {
      name: { type: 'text', placeholder: 'Name', value: '' },
      surname: { type: 'text', placeholder: 'Surname', value: '' },
      email: { type: 'text', placeholder: 'Email', value: '' },
      password: { type: 'password', placeholder: 'Password', value: '' },
      confirmPassword: { type: 'password', placeholder: 'Confirm password', value: '' },
      role: {
        type: 'select',
        placeholder: 'Select Role',
        selectOptions: this.getChooseRoleSelect(),
        value: '', 
      }
    };
  }

  private getDeleteUserInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select user',
        selectOptions: this.getAllUsersSelect(),
        value: '', 
      }
    };
  }

  private getResetPasswordInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select user',
        selectOptions: this.getAllUsersSelect(),
        value: '', 
      },
      newPassword: { type: 'password', placeholder: 'New Password', value: '' },
      confirmPassword: { type: 'password', placeholder: 'Confirm Password', value: '' },
    };
  }

  private getGrantPermissionsInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select user',
        selectOptions: this.getAllUsersSelect(),
        value: '', 
      },
      role: {
        type: 'select',
        placeholder: 'Grant permissions',
        selectOptions: this.getChooseRoleSelect(),
        value: '', 
      }
    };
  }

  private addUser() {
    console.log('Adding user...');
  }

  private deleteUser() {
    console.log('Deleting user...');
  }

  private resetUserPassword() {
    console.log('Resetting user password...');
  }

  private grantPermissions() {
    console.log('Granting permissions...');
  }
}
