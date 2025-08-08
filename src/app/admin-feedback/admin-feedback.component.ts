import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.css']
})
export class AdminFeedbackComponent implements OnInit {
  feedbackList: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    this.userService.getFeedback().subscribe(response => {
      this.feedbackList = response;
    });
  }

  resolveFeedback(feedbackId: number) {
  this.userService.markFeedbackResolved(feedbackId).subscribe(() => {
    // ✅ Find the resolved feedback and update its status
    const feedbackItem = this.feedbackList.find(f => f.id === feedbackId);
    if (feedbackItem) {
      feedbackItem.status = 'Resolved'; // ✅ Update status
    }
  });
}

goBack() {
    this.router.navigate(['/admin']); // ✅ Redirect to dashboard
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }
}