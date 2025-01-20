import {
  Directive,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserService } from '../service/user.service';
import { Roles } from 'src/app/models/enums/roles.enum';

@Directive({
  selector: '[appPermission]',
})
export class PermissionRestrictDirective implements OnChanges {
  @Input() appPermission: Roles = Roles.User;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnChanges(): void {
    this.viewContainer.clear();
    this.userService.user$.subscribe((user) => {
      if (
        user?.role == Roles.Guard
      ) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
