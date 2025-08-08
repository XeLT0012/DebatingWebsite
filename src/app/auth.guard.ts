import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getSession().pipe(
      first(), // ✅ Ensures API response is awaited
      map(response => {
        if (response.user) {
          return true;
        } else {
          this.router.navigate(['/login']); // 🚨 Redirect unauthorized users
          return false;
        }
      })
    );
  }
}