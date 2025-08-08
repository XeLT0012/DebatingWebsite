import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-debate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-debate.component.html',
  styleUrls: ['./create-debate.component.css']
})
export class CreateDebateComponent {
  debate = {
  title: '',
  description: '',
  category: '',
  debate_type: 'Public',
  deadline: '',
  result: 'Pending',
  state: 'Ongoing',
  created_by: 0
};
  message = '';

  constructor(private userService: UserService, private router: Router) {}

submitDebate() {
  this.debate.created_by = parseInt(localStorage.getItem("user_id") || "0", 10);

  // ✅ Ensure ENUM value matches SQL requirements
  this.debate.debate_type = this.debate.debate_type === 'Private' ? 'Private' : 'Public';

  if (
    !this.debate.title ||
    !this.debate.description ||
    !this.debate.created_by ||
    !this.debate.deadline ||
    !this.debate.category
  ) {
    alert("All fields including title, description, category, type, and deadline are required!");
    return;
  }

  this.userService.createDebate(this.debate).subscribe(response => {
    console.log("Server response:", response);
    this.message = response.message || response.error;

    // 🧹 Clear all fields except created_by
    this.debate.title = '';
    this.debate.description = '';
    this.debate.category = '';
    this.debate.debate_type = '';
    this.debate.deadline = '';

    // 🧹 Clear status message after 3 seconds
    setTimeout(() => {
      this.message = '';
    }, 3000);
  });
}


getUserId(): number {
  // ✅ Replace with actual logic to get user ID (from authentication service, session, etc.)
  return parseInt(localStorage.getItem("user_id") || "0", 10);
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