import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-debates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-debates.component.html',
  styleUrls: ['./my-debates.component.css']
})
export class MyDebatesComponent implements OnInit {
  myDebates: any[] = [];
  searchQuery = '';
  userId = parseInt(localStorage.getItem("user_id") || "0", 10);

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.fetchMyDebates();
  }

  fetchMyDebates() {
    this.userService.listMyDebates(this.userId, this.searchQuery).subscribe((response: any[]) => {
      const processedDebates = response.map(debate => ({
        ...debate,
        is_locked: debate.is_locked === 1 || debate.is_locked === '1'
      }));
      this.myDebates = processedDebates;
    });
  }

  refreshMyDebates() {
    this.searchQuery = '';
    this.fetchMyDebates();
  }

  redirectToDebate(debateId: number, isLocked: boolean) {
    if (isLocked) {
      alert("🚫 This debate has been locked by an admin and cannot be accessed.");
    } else {
      this.router.navigate([`/debate/${debateId}`], { queryParams: { from: 'my-debates' } });
    }
  }

  goBack() {
    this.router.navigate(['/hello']);
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }
}
