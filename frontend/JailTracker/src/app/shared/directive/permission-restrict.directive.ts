import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { UserService } from '../service/user.service';
import { Roles } from 'src/app/models/enums/roles.enum';

@Directive({
  selector: '[appPermission]',
})
export class PermissionRestrictDirective implements OnChanges {
  @Input() appPermission: PermissionTypes = PermissionTypes.BasicRead;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnChanges(): void {
    this.viewContainer.clear();

    this.userService.user$.subscribe((user) => {
      if (
        user?.permissions?.includes(this.appPermission) ||
        user?.role == Roles.PageAdmin ||
        user?.role == Roles.OrganizationOwner
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
