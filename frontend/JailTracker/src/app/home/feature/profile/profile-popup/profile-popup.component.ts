import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateUserDto } from 'src/app/models/update-user.model';
import { UserService } from 'src/app/shared/data-access/service/user.service';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss'],
})
export class ProfilePopupComponent {
  passwordForm: FormGroup;
  userId: string;
  organizationId: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProfilePopupComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.userId = data.userId;
    this.organizationId = data.organizationId;
  }

  closePopup() {
    this.dialogRef.close('primary');
  }

  updateUser(): void {
    const updateUserDto: UpdateUserDto = {
      password: String(this.passwordForm.get('password')?.value),
    };

    if (this.userId && this.organizationId) {
      this.userService.updateUser(updateUserDto).subscribe((res: any) => {
        if (res) {
          location.reload();
        }
      });
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;

    const confirmPassword = confirmPasswordControl.value;
    if (confirmPassword.length == 0) {
      return null;
    }
    if (
      password.length < 7 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return { invalidPassword: true };
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
