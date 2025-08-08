import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✅ Added Reactive Forms
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  profilePicture: File | null = null;
  message = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    console.log("Register Component Loaded!");
    
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', Validators.required],
      bio: [''],
      dateOfBirth: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.message = "Please fill all required fields correctly!";
      return;
    }

    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach(key => {
      formData.append(key, this.registerForm.value[key]);
    });

    if (this.profilePicture) {
      formData.append('profile_picture', this.profilePicture);
    }

    console.log("Sending Data to API:", this.registerForm.value);

    this.userService.register(formData).subscribe(response => {
      console.log("API Response:", response);
      this.message = response.message || response.error;

      if (response.message) {
        alert("Registration successful! You can now log in.");
        this.router.navigate(['/login']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profilePicture = file;
      console.log("Selected File:", file);
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }

  navigateTo(route: string) {
    console.log("Navigating to:", route);
    this.router.navigate([route]).then(() => {
      console.log("Navigation success:", route);
    }).catch(error => {
      console.error("Navigation failed:", error);
    });
  }
}

