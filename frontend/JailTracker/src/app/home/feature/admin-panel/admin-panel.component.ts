import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from 'src/app/models/dictionary.model';
import {
  InputPopupDataModel,
  InputPopupModel,
  ButtonTypes,
  SelectOptionPopupModel
} from 'src/app/models/input-popup-data.model';
import { PopupWithInputsComponent } from 'src/app/shared/ui/popup-with-inputs/popup-with-inputs.component';
import { RegisterDto } from 'src/app/models/register.model';
import { Roles } from 'src/app/models/enums/roles.enum';
import { UserService } from '../../../shared/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { ResetPasswordDto } from 'src/app/models/reset-password.model';
import { SetSupervisorDto } from 'src/app/models/set-supervisor.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {

  usersSelectOptions: SelectOptionPopupModel[] = [];
  prisonersSelectOptions: SelectOptionPopupModel[] = [];
  supervisorsSelectOptions: SelectOptionPopupModel[] = [];

  constructor(private dialog: MatDialog, private userService: UserService, private toastrService: ToastrService) {
    this.loadUsersSelectOptions('users'); 
    this.loadUsersSelectOptions('prisoners');
    this.loadUsersSelectOptions('supervisors');
  }

  handleAction(actionType: string) {
    console.log('Action type:', actionType);
    switch (actionType) {
      case 'add-user':
        const inputsAddUser = this.getAddUserInputs();
        this.openPopup({
          title: 'Add User',
          description: 'Fill in the details to add a new user.',
          inputs: inputsAddUser,
          buttons: [
            {
              type: ButtonTypes.PRIMARY,
              text: 'Confirm',
              onClick: () => {
                this.addUser(inputsAddUser);
              },
            },
            {
              type: ButtonTypes.SECONDARY,
              text: 'Cancel',
              onClick: () => this.dialog.closeAll(),
            },
          ]
        });
        break;
      case 'delete-user':
        const inputsDeleteUser = this.getDeleteUserInputs();
        this.openPopup({
          title: 'Delete User',
          description: 'Choose user to remove.',
          inputs: inputsDeleteUser,
          buttons: [
            {
              type: ButtonTypes.PRIMARY,
              text: 'Confirm',
              onClick: () => {
                this.deleteUser(inputsDeleteUser);
              },
            },
            {
              type: ButtonTypes.SECONDARY,
              text: 'Cancel',
              onClick: () => this.dialog.closeAll(),
            },
          ]
        });
        break;
      case 'reset-password':
        const inputsResetPassword = this.getResetPasswordInputs();
        this.openPopup({
          title: 'Reset User Password',
          description: 'Enter the username and new password.',
          inputs: inputsResetPassword,
          buttons: [
            {
              type: ButtonTypes.PRIMARY,
              text: 'Confirm',
              onClick: () => {
                this.resetUserPassword(inputsResetPassword);
              },
            },
            {
              type: ButtonTypes.SECONDARY,
              text: 'Cancel',
              onClick: () => this.dialog.closeAll(),
            },
          ]
        });
        break;
      case 'set-supervisor':
        const inputsSetSupervisor = this.getSetSupervisorInputs();
        this.openPopup({
          title: 'Set supervisor',
          description: 'Select prisoners supervisor.',
          inputs: inputsSetSupervisor,
          buttons: [
            {
              type: ButtonTypes.PRIMARY,
              text: 'Confirm',
              onClick: () => {
                this.setSupervisor(inputsSetSupervisor);
              },
            },
            {
              type: ButtonTypes.SECONDARY,
              text: 'Cancel',
              onClick: () => this.dialog.closeAll(),
            },
          ]
        });
        break;
      default:
        console.error('Invalid action type');
    }
  }

  private openPopup(data: InputPopupDataModel) {
    console.log(data);
    this.dialog.open(PopupWithInputsComponent, {
      data: data,
      panelClass: 'jail-tracker-popup',
    });
  }

  private getChooseRoleSelect(): SelectOptionPopupModel[] {
    return [
      { value: Roles.Guard, displayValue: 'Supervisor' },
      { value: Roles.User, displayValue: 'Prisoner' },
    ];
  }
  
  loadUsersSelectOptions(type: 'users' | 'prisoners' | 'supervisors'): void {
    switch (type) {
      case 'users':
        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.usersSelectOptions = this.convertToSelectOptions(users);
          },
          error: () => {
            this.toastrService.error('An error occurred while fetching all users.');
          },
        });
        break;
  
      case 'prisoners':
        this.userService.getPrisoners().subscribe({
          next: (prisoners) => {
            this.prisonersSelectOptions = this.convertToSelectOptions(prisoners);
          },
          error: () => {
            this.toastrService.error('An error occurred while fetching prisoners.');
          },
        });
        break;
  
      case 'supervisors':
        this.userService.getSupervisors().subscribe({
          next: (supervisors) => {
            this.supervisorsSelectOptions = this.convertToSelectOptions(supervisors);
          },
          error: () => {
            this.toastrService.error('An error occurred while fetching supervisors.');
          },
        });
        break;
  
      default:
        this.toastrService.error('Invalid user type specified.');
    }
  }
  
  private convertToSelectOptions(users: User[]): SelectOptionPopupModel[] {
    console.log(users);
    return users.map(user => ({
      value: user.id ?? '', 
      displayValue: `${user.firstName} ${user.lastName}`
    }));
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
      },
    };
  }

  private getDeleteUserInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select user',
        selectOptions: this.usersSelectOptions,
        value: '', 
      }
    };
  }

  private getResetPasswordInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select user',
        selectOptions: this.usersSelectOptions,
        value: '', 
      },
      newPassword: { type: 'password', placeholder: 'New Password', value: '' },
      confirmPassword: { type: 'password', placeholder: 'Confirm Password', value: '' },
    };
  }

  private getSetSupervisorInputs(): Dictionary<InputPopupModel> {
    return {
      user: {
        type: 'select',
        placeholder: 'Select prisoner',
        selectOptions: this.prisonersSelectOptions,
        value: '', 
      },
      supervisor: {
        type: 'select',
        placeholder: 'Set supervisor',
        selectOptions: this.supervisorsSelectOptions,
        value: '', 
      }
    };
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  private addUser(inputs: Dictionary<InputPopupModel>): void {
    const email = String(inputs['email'].value);
  
    if (!this.validateEmail(email)) {
      this.toastrService.error('Please enter a valid email address.', 'Email Error');
      return;
    }
  
    const registerDto: RegisterDto = {
      firstName: String(inputs['name'].value),
      lastName: String(inputs['surname'].value),
      email: email,
      password: String(inputs['password'].value),
      role: Number(inputs['role'].value),
    };
  
    const validationError = this.validateRegisterDto(registerDto);
    if (validationError) {
      this.toastrService.error(validationError, 'Validation Error');
      return;  
    }
  
    this.userService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.toastrService.error('This email is already taken.', 'Email Error');
          return;
        }
        this.userService.createUser(registerDto).subscribe({
          next: () => {
            this.dialog.closeAll();
            if (registerDto.role === Roles.User) {
              this.toastrService.success('Successfully added prisoner. Please, set the supervisor.');
            } else  {
              this.toastrService.success('Successfully added supervisor.');
            } 
            setTimeout(() => {
              location.reload();
            }, 4500);
            return true;
          },
          error: (err) => {
            this.toastrService.error('An error occurred while adding the user.');
            return false;
          },
        });
      },
      error: () => {
        this.toastrService.error('An error occurred while checking the email.', 'Error');
      },
    });
  }
  
  private validateRegisterDto(registerDto: RegisterDto): string | null {

    if (!registerDto.firstName) {
      return 'First Name is required';
    }
    if (!registerDto.lastName) {
      return 'Last Name is required';
    }
    if (!registerDto.password) {
      return 'Password is required';
    }
    if (registerDto.role === null) {
      return 'Role is required';
    }
    return null;
  }
  
  private deleteUser(inputs: Dictionary<InputPopupModel>): void {

    const selectedUserId = inputs['user'].value;
    if (!selectedUserId) {
      this.toastrService.error('No user selected.', 'Error');
      return;
    }
  
    const userIdNumber = Number(selectedUserId); 
    
    this.userService.deleteUser(userIdNumber).subscribe({
      next: () => {
        this.dialog.closeAll(),
        this.toastrService.success('User successfully deleted.');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: (err) => {
        this.toastrService.error('An error occurred while deleting the user.', 'Error');
      },
    });
  }
  
  private resetUserPassword(inputs: Dictionary<InputPopupModel>): void {

    const userId = inputs['user'].value;
    if (!userId) {
      this.toastrService.error('No user selected.', 'Error');
      return;
    }
  
    const userIdToNumber = Number(userId); 

    const updateUserDto: ResetPasswordDto = {
      id: userIdToNumber,
      password: String(inputs['newPassword'].value)
    };

    const newPassword = inputs['newPassword'].value;
    const confirmPassword = String(inputs['confirmPassword'].value);
  
    if (!newPassword || !confirmPassword) {
      this.toastrService.error('Both password fields are required.', 'Error');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      this.toastrService.error('Passwords do not match.', 'Error');
      return;
    }
  
    this.userService.resetPassword(updateUserDto).subscribe({
      next: () => {
        this.dialog.closeAll(),
        this.toastrService.success('Password successfully updated.');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: (err) => {
        this.toastrService.error('An error occurred while deleting the user.', 'Error');
      },
    });
  }
  
  private setSupervisor(inputs: Dictionary<InputPopupModel>): void {

    const userId = inputs['user'].value;
    if (!userId) {
      this.toastrService.error('No user selected.', 'Error');
      return;
    }
  
    const userIdToNumber = Number(userId); 

    const supervisorId = inputs['supervisor'].value;
    if (!supervisorId) {
      this.toastrService.error('No user selected.', 'Error');
      return;
    }
  
    const supervisorIdToNumber = Number(supervisorId); 

    const setSupervisorDto: SetSupervisorDto = {
      userId: userIdToNumber,
      currentRequestsSupervisorId: supervisorIdToNumber
    };

    this.userService.setUserSupervisor(setSupervisorDto).subscribe({
      next: () => {
        this.dialog.closeAll(),
        this.toastrService.success('Supervisor successfully set.');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: (err) => {
        this.toastrService.error('An error occurred while setting the supervisor.', 'Error');
      },
    });
  }
}