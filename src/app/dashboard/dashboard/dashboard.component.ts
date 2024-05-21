import { state } from '@angular/animations';
import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  //toggleNavbar = true;
  username: any;
  constructor(private router: Router, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.username = localStorage.getItem('UserName');
          console.log('Hello');
        });
      }, 0);
    });
  }

  logout() {
    const confirmation = confirm('Do you want to logout');
    if (confirmation) {
      localStorage.removeItem('UserName');
      localStorage.removeItem('photographer_Id');
      localStorage.removeItem('adminId');
      this.router.navigate(['login']);
    }
  }
}
