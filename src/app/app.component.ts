import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    console.log("Navigating to:", route);
    this.router.navigate([route]).then(() => {
      console.log("Navigation success:", route);
    }).catch(error => {
      console.error("Navigation failed:", error);
    });
  }
}

