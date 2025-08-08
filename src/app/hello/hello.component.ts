import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  username: string = '';
  userId: number = parseInt(localStorage.getItem("user_id") || "0", 10);
  createdDebates: any[] = [];
  participatedDebates: any[] = [];
  leaderboard: any[] = [];
  controversialDebates: any[] = [];
  popularTopics: any[] = [];
  totalVotes: number = 0;
  totalArguments: number = 0;
  totalDebates: number = 0;
  totalUsers: number = 0;

  constructor(private userService: UserService, private router: Router) {
    this.checkSession();
  }

  checkSession() {
    this.userService.getSession().subscribe(response => {
      if (response && response.user) {
        this.username = response.user;
        this.loadDashboardData();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadDashboardData() {
    if (!this.userId) return;

    this.userService.listMyDebates(this.userId).subscribe(response => {
      this.createdDebates = response.length > 0 ? response : [];
    });

    this.userService.listParticipatedDebates(this.userId).subscribe(response => {
      this.participatedDebates = response.length > 0 ? response : [];
      this.totalVotes = response.reduce((acc: number, debate: any) => acc + (debate.user_vote_count || 0), 0);
      this.totalArguments = response.reduce((acc: number, debate: any) => acc + (debate.user_argument_count || 0), 0);
    });

    this.userService.getLeaderboard().subscribe(response => {
      this.leaderboard = response.length > 0 ? response : [];
    });

    this.userService.getMostControversialDebates().subscribe(response => {
      this.controversialDebates = response.length > 0 ? response : [];
    });

    this.userService.getPopularTopics().subscribe(response => {
      this.popularTopics = response.length > 0 ? response : [];
    });

    this.userService.getPlatformStats().subscribe(response => {
      this.totalDebates = response.totalDebates ? Number(response.totalDebates) : 0;
      this.totalUsers = response.totalUsers ? Number(response.totalUsers) : 0;
    });
  }

  viewProfile() {
    this.router.navigate(['/profile']);
  }

  userFeedback() {
    this.router.navigate(['/feedback']);
  }

  goToMyDebates() {
    this.router.navigate(['/my-debates']);
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }
}