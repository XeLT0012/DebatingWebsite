import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  totalUsers: number = 0;
  newUsers: number = 0;
  topActiveUsers: any[] = [];
  totalDebates: number = 0;
  popularTopics: string[] = [];
  topContributors: string[] = [];
  totalVotes: number = 0;
  popularDebates: any[] = [];
  totalArguments: number = 0;
  pendingFeedback: number = 0;
  resolvedFeedback: number = 0;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.checkSession();
    this.loadAdminStats();
  }

  checkSession() {
    this.userService.getSession().subscribe(response => {
      if (!response || response.user !== 'admin') {
        this.router.navigate(['/login']);
      }
    });
  }

  loadAdminStats() {
    this.userService.getAdminStats().subscribe(stats => {
      this.totalUsers = stats.totalUsers;
      this.newUsers = stats.newUsers;

      // ✅ Filter out empty categories
      this.popularTopics = stats.popularTopics
  .filter((topic: { category: string }) => topic.category !== "")
  .map((topic: { category: string }) => topic.category);

      // ✅ Format top active users for clarity
      this.topActiveUsers = stats.topActiveUsers.map((user: { username: string; activity_score: number }) => 
      `${user.username} (Activity Score: ${user.activity_score})`
      );
      this.totalDebates = stats.totalDebates;
      this.topContributors = stats.topContributors.map((user: { username: string }) => user.username);

      this.totalVotes = stats.totalVotes;

      // ✅ Format popular debates for readability
      this.popularDebates = stats.popularDebates.map((debate: { debate_id: number; votes: number }) => 
      `Debate #${debate.debate_id} - Votes: ${debate.votes}`
      );

      this.totalArguments = stats.totalArguments;
      this.pendingFeedback = stats.pendingFeedback;
      this.resolvedFeedback = stats.resolvedFeedback;
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }

  goToUserManagement() {
    this.router.navigate(['/user-management']);
  }

  debateModeration() {
    this.router.navigate(['/debate-moderation']);
  }

  goToArgumentManagement() {
    this.router.navigate(['/argument-management']);
  }

  adminFeedback() {
    this.router.navigate(['/admin-feedback']);
  }
}