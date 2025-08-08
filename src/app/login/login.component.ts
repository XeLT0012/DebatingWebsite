import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { username: '', password: '' };
  message = '';

  constructor(private userService: UserService, private router: Router) {
    console.log("Login Component Loaded!");
  }
  
login() {
  this.userService.login(this.user).subscribe(response => {
    if (response.user) {
      localStorage.setItem("user_id", response.user.id); // ✅ Store user ID
      localStorage.setItem("username", response.user.username); // ✅ Store username

      if (response.user.username === "admin") {  
        this.router.navigate(['/admin']); // ✅ Redirect admins to Admin Page  
      } else {  
        this.router.navigate(['/hello']); // ✅ Redirect regular users to Hello Page  
      }
    } else {
      alert(response.error);
    }
  });
}

  navigateTo(route: string) {
    console.log("Navigating to:", route);
    this.router.navigate([route]).then(() => {
      console.log("Navigation success:", route);
    }).catch(error => {
      console.error("Navigation failed:", error);
    });
  }

  forgotPasswordMode = false; // ✅ Track password reset mode
passwordData = { username: '', current_password: '', new_password: '' };

toggleForgotPassword() {
  this.forgotPasswordMode = !this.forgotPasswordMode; // ✅ Show/Hide form
}

changePassword() {
  this.userService.changePassword(this.passwordData).subscribe(
    (response: any) => {
      console.log("API Response:", response); // ✅ Debugging log
      if ('message' in response) { // ✅ Safely check if "message" exists
        alert(response.message);
        this.passwordData = { username: '', current_password: '', new_password: '' }; // ✅ Clear fields
        this.forgotPasswordMode = false; // ✅ Hide the form
        this.router.navigate(['/login']); // ✅ Redirect back to login page
      } else {
        console.error("Unexpected API response format:", response);
        alert("Unexpected error. Please try again.");
      }
    },
    error => {
      console.error("Failed to update password:", error);
      alert("Failed to update password. Please try again.");
    }
  );
}
}