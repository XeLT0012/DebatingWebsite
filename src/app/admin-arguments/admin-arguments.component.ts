import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-arguments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-arguments.component.html',
  styleUrls: ['./admin-arguments.component.css']
})
export class AdminArgumentsComponent implements OnInit {
  argumentsList: any[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadArguments();
  }

  loadArguments() {
    this.userService.getArguments().subscribe(data => {
      console.log(data); // Debug: Check what's coming from API
      this.argumentsList = data.map((arg: {
        id: number,
        username: string,
        debate_title: string,
        argument: string,
        created_at: string,
        is_archived: any
      }) => ({
        ...arg,
        is_archived: Boolean(Number(arg.is_archived)) // ✅ Convert "0"/"1" or 0/1 to boolean
      }));
    });
  }

  archiveArgument(argumentId: number) {
    this.userService.archiveArgument(argumentId).subscribe(() => {
      const arg = this.argumentsList.find(arg => arg.id === argumentId);
      if (arg) {
        arg.is_archived = true; // ✅ Set boolean, not number
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
