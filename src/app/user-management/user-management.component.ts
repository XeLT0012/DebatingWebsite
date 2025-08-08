import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  updateMessage = '';

  constructor(private userService: UserService, private router: Router) {
    this.loadUsers();
  }

  loadUsers() {
  this.userService.getAllUsers().subscribe(response => {
    this.users = response.map((user: any) => ({
  ...user,
  is_blocked: !!user.is_blocked
}));
    this.filteredUsers = this.users;
  });
}

  searchUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  refresh() {
    this.searchQuery = ''; // ✅ Reset search input
    this.loadUsers();   // ✅ Reload all debates
  }

  editUser(user: any) {
  this.selectedUser = { ...user };
}

saveUserChanges() {
  this.userService.updateUserDetails(this.selectedUser).subscribe(() => {
    this.loadUsers();
    this.selectedUser = null;
    this.updateMessage = '✅ User details updated successfully!';
    setTimeout(() => this.updateMessage = '', 3000); // Auto-clear after 3s
  });
}

  cancelEdit() {
    this.selectedUser = null;
  }

  toggleBlockUser(userId: number, isBlocked: boolean) {
  console.log("Before Block: ", userId, "Blocked:", isBlocked); // ✅ Debugging

  const action = isBlocked ? "unblock" : "block";
  const confirmAction = confirm(`Are you sure you want to ${action} this user?`);

  if (confirmAction) {
    this.userService.blockUser(userId, !isBlocked).subscribe(response => {
      alert(response.message);
      this.loadUsers();
      
      this.users = this.users.map(user => 
        user.id === userId ? { ...user, is_blocked: !isBlocked } : user
      );

      console.log("After Block: ", this.users.find(user => user.id === userId)); // ✅ Debugging
    });
  }
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

