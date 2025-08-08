import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 userData: any;
 editMode = false; // ✅ Track edit mode
 updateSuccess = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      response => {
        console.log("Profile data received:", response); // Debug log
        this.userData = response;
      },
      error => {
        console.error("Error fetching profile data:", error);
      }
    );
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateProfile() {
  this.userService.updateProfile(this.userData).subscribe(
    (response: any) => {
      if (response.user) {
        console.log("Updated profile data received:", response.user); // ✅ Debugging log
        this.userData = response.user; // ✅ Update UI
      } else {
        console.error("Error: API response missing user data", response);
      }
      this.editMode = false;
      this.updateSuccess = true;
    setTimeout(() => this.updateSuccess = false, 3000); // hide after 3s
    },
    error => {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  );
}

  goBack() {
    this.router.navigate(['/hello']); // ✅ Redirect to dashboard
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }

}