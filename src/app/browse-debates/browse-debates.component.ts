import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-debates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-debates.component.html',
  styleUrls: ['./browse-debates.component.css']
})
export class BrowseDebatesComponent implements OnInit {
  debates: any[] = [];
  searchQuery = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.fetchDebates();
  }

  fetchDebates() {
    this.userService.listDebates(this.searchQuery).subscribe((response: any[]) => {
      console.log("API Response:", response);

      // Convert is_locked to boolean
      const processedDebates = response.map(debate => ({
        ...debate,
        is_locked: debate.is_locked === 1 || debate.is_locked === '1'
      }));

      this.debates = processedDebates;
      console.log("Filtered Debates:", this.debates);
    });
  }

  refreshDebates() {
    this.searchQuery = '';
    this.fetchDebates();
  }

  redirectToDebate(debateId: number, isLocked: boolean) {
    if (isLocked) {
      alert("🚫 This debate has been locked by an admin and cannot be accessed.");
    } else {
      this.router.navigate([`/debate/${debateId}`]);
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
