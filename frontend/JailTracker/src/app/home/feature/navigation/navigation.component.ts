import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionTypes } from 'src/app/models/enums/permission-types.enum';
import { UserService } from 'src/app/shared/service/user.service';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public activeIndex = 0;

  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.setActiveIndexFromActivePath();
  }

  public onItemClick(index: number) {
    this.activeIndex = index;
  }

  public isMenuActive(index: number) {
    return this.activeIndex == index;
  }

  public async logout(): Promise<void> {
    this.userService.logout();
    await this.router.navigateByUrl('/login');
  }

  public get menuData() {
    var menuData = [
      {
        icon: 'dashboard',
        text: 'Dashboard',
        router_link: `/dashboard`,
      },
      { icon: 'person_outline', text: 'Profile', router_link: `/profile` },
      {
        icon: 'calendar_today',
        text: 'Calendar',
        router_link: `/calendar`,
      },
    ];

    if (this.userService.hasPermission(PermissionTypes.CanSupervise)) {
      menuData.push({
        icon: 'event_note',
        text: 'Requests',
        router_link: `/requests`,
      });
    }
    if (this.userService.isUser()) {
      menuData.push({
        icon: 'post_add',
        text: 'Create new request',
        router_link: `/new_request`,
      });
    }

    return menuData;
  }

  trackByFn(
    index: number,
    item: { icon: string; text: string; router_link: string }
  ) {
    return item.router_link;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    const acvitePath = window.location.pathname;
    if (acvitePath == '/admin-panel') this.activeIndex = this.menuData.length;
    else
      this.activeIndex = this.menuData.findIndex(
        (x) => x.router_link == acvitePath
      );
  }

  private setActiveIndexFromActivePath() {
    const acvitePath = window.location.pathname;
    const newIndex = this.menuData.findIndex(
      (x) => x.router_link == acvitePath
    );
    if (newIndex >= 0) this.activeIndex = newIndex;
    this.activeIndex = 0;
  }
}
