import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debate-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debate-moderation.component.html',
  styleUrls: ['./debate-moderation.component.css']
})
export class DebateModerationComponent {
  debates: any[] = [];
  filteredDebates: any[] = [];
  searchQuery: string = '';
  editingDebate: number | null = null;

  constructor(private userService: UserService, private router: Router) {
    this.loadDebates();
  }

  loadDebates() {
  this.userService.getAllDebates().subscribe((response: any[]) => {
    const currentDate = new Date();

    this.debates = response.map(debate => ({
      ...debate,
      state: debate.deadline && new Date(debate.deadline) < currentDate ? 'Finished' : 'Ongoing' // ✅ Ensure deadline is valid
    }));

    this.filteredDebates = this.debates;
  });
}

  searchDebates() {
    this.filteredDebates = this.debates.filter(debate =>
      debate.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  refreshDebates() {
    this.searchQuery = '';
    this.loadDebates();
  }

  toggleLockDebate(debate: any) {
    const newLockStatus = !debate.is_locked;

    this.userService.lockDebate(debate.id, newLockStatus).subscribe(() => {
      alert(`Debate ${newLockStatus ? 'locked' : 'unlocked'} successfully!`);
      this.loadDebates();
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



