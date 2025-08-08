import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { RegisterComponent } from './app/register/register.component';
import { LoginComponent } from './app/login/login.component';
import { HelloComponent } from './app/hello/hello.component';
import { ProfileComponent } from './app/profile/profile.component'; // ✅ Import ProfileComponent
import { CreateDebateComponent } from './app/create-debate/create-debate.component';
import { BrowseDebatesComponent } from './app/browse-debates/browse-debates.component';
import { DebatePageComponent } from './app/debate-page/debate-page.component';
import { MyDebatesComponent } from './app/my-debates/my-debates.component';
import { AdminComponent } from './app/admin/admin.component';
import { UserManagementComponent } from './app/user-management/user-management.component';
import { DebateModerationComponent } from './app/debate-moderation/debate-moderation.component';
import { FeedbackComponent } from './app/feedback/feedback.component';
import { AdminFeedbackComponent } from './app/admin-feedback/admin-feedback.component';
import { AdminArgumentsComponent } from './app/admin-arguments/admin-arguments.component';
import { AuthGuard } from './app/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hello', component: HelloComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // ✅ Added Profile Route
  { path: 'create-debate', component: CreateDebateComponent, canActivate: [AuthGuard] },
  { path: 'debates', component: BrowseDebatesComponent, canActivate: [AuthGuard] },
  { path: 'debate/:debateId', component: DebatePageComponent, canActivate: [AuthGuard] },
  { path: 'my-debates', component: MyDebatesComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'debate-moderation', component: DebateModerationComponent, canActivate: [AuthGuard] },
  { path: 'argument-management', component: AdminArgumentsComponent, canActivate: [AuthGuard] },
  { path: 'feedback', component: FeedbackComponent, canActivate: [AuthGuard] },
  { path: 'admin-feedback', component: AdminFeedbackComponent, canActivate: [AuthGuard] },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
});
