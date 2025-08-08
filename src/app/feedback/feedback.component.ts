import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  feedback = { subject: '', description: '' };
  message = '';

  constructor(private userService: UserService, private router: Router) {}

  submitFeedback(feedback: any): void {
  if (!feedback.subject || !feedback.description.trim()) {
    alert("Feedback cannot be blank!");
    return;
  }

  this.userService.sendFeedback(feedback).subscribe(response => {
    console.log("Feedback submitted successfully!", response);
    this.message = '✅ Feedback submitted successfully!';
    this.feedback = { subject: '', description: '' }; // Clear fields
    setTimeout(() => this.message = '', 4000); // Optional: auto-hide message
  });
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