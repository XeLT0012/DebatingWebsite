import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debate-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debate-page.component.html',
  styleUrls: ['./debate-page.component.css']
})
export class DebatePageComponent implements OnInit {
  debateId!: number;
  argumentText = '';
  votes = { for: 0, against: 0 };
  debate: any = {};
  argumentsList: any[] = [];

  previousPage!: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.debateId = Number(this.route.snapshot.paramMap.get('debateId'));
    this.previousPage = this.route.snapshot.queryParamMap.get('from') || 'browse-debates';

    this.loadDebateDetails();
    this.loadVotes();
    this.loadDebateArguments(this.debateId);
  }

  loadDebateDetails() {
    this.userService.getDebateDetails(this.debateId).subscribe(response => {
      this.debate = response;
    });
  }

  loadVotes() {
    this.userService.listVotes(this.debateId).subscribe(response => {
      this.votes = response;
    });
  }

  loadDebateArguments(debateId: number) {
    this.userService.getDebateArguments(debateId).subscribe((data: any[]) => {
      this.argumentsList = data;
    });
  }

  voteDebate(side: string) {
    const userId = parseInt(localStorage.getItem("user_id") || "0", 10);
    if (!userId || !this.debateId) {
      alert("Error: User ID or Debate ID is missing!");
      return;
    }

    this.userService.voteDebate(this.debateId, userId, side).subscribe(() => {
      this.loadVotes();
    });
  }

  submitArgument() {
    const userId = parseInt(localStorage.getItem("user_id") || "0", 10);
    if (!userId) {
      alert("Error: User ID is missing! Please log in.");
      return;
    }

    this.userService.submitArgument(this.debateId, userId, this.argumentText).subscribe(() => {
      this.argumentText = '';
      this.loadDebateArguments(this.debateId); // Refresh list after submission
    });
  }

  logout() {
    this.userService.logout().subscribe(() => {
      localStorage.removeItem('user_id');
      this.router.navigate(['/login']);
    });
  }
}
