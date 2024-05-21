import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photographer-dashboard',
  templateUrl: './photographer-dashboard.component.html',
  styleUrl: './photographer-dashboard.component.css',
})
export class PhotographerDashboardComponent implements AfterViewInit {
  toggleNavbar = true;
  username: any;
  constructor(private router: Router, private ngZone: NgZone) {}
  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.username = localStorage.getItem('UserName');
          console.log("Hello")
        });
      }, 0);
    });
  }

  dashboard() {
    const body = document.querySelector('body') as HTMLBodyElement;
    const sidebar = body.querySelector('nav') as HTMLElement;
    const toggle = body.querySelector('.toggle') as HTMLElement;
    const searchBtn = body.querySelector('.search-box') as HTMLElement;
    const modeSwitch = body.querySelector('.toggle-switch') as HTMLElement;
    const modeText = body.querySelector('.mode-text') as HTMLElement;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('close');
    });

    searchBtn.addEventListener('click', () => {
      sidebar.classList.remove('close');
    });

    modeSwitch.addEventListener('click', () => {
      body.classList.toggle('dark');
      if (body.classList.contains('dark')) {
        modeText.innerText = 'Light mode';
        console.log('fail');
      } else {
        modeText.innerText = 'Dark mode';
        console.log('succes');
      }
    });
  }
  logout() {
    const confirmation = confirm('Do you want to logout');
    if (confirmation) {
      localStorage.removeItem('UserName');
      localStorage.removeItem('photographer_Id');
      localStorage.removeItem('adminId');
      this.router.navigate(['/login']);
    }
  }
}
