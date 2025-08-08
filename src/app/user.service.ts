import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // ✅ Ensure tap is imported correctly

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost/crud-app/php-backend/api.php';

  constructor(private http: HttpClient) {}

  /** Register a new user */
  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=register`, formData, {
      withCredentials: true
    });
  }

  /** Login user & start session */
  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?action=login`, user, { withCredentials: true }); // ✅ Send credentials
  }

  /** Check if user is authenticated */
  isAuthenticated(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getUserSession`, { withCredentials: true }); // ✅ Corrected endpoint
  }

  /** Logout user & destroy session */
logout(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=logout`, { withCredentials: true }).pipe(
    tap(() => {
      localStorage.removeItem('user_id'); // ✅ Ensure stored user ID is cleared
    })
  );
}

  /** Get user session details */
  getSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=getUserSession`, { withCredentials: true });
  }
  
  createDebate(debate: any): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=createDebate`, JSON.stringify(debate), {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });
}

  listDebates(searchQuery = ''): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=listDebates&search=${searchQuery}`, { withCredentials: true });
}

getDebateDetails(debateId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getDebateDetails&debate_id=${debateId}`);
}

  voteDebate(debateId: number, userId: number, side: string): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=voteDebate`, { debate_id: debateId, user_id: userId, side }, { withCredentials: true });
}

submitArgument(debateId: number, userId: number, argument: string): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=submitArgument`, { debate_id: debateId, user_id: userId, argument }, { withCredentials: true });
}

listVotes(debateId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=listVotes&debate_id=${debateId}`, { withCredentials: true });
}

listArguments(debateId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=listArguments&debate_id=${debateId}`, { withCredentials: true });
}

getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}?action=profile`, {
      responseType: 'json',
      withCredentials: true
    });
  }

  updateProfile(userData: any) {
  return this.http.post(`${this.apiUrl}?action=updateProfile`, userData, {
    headers: { 'Content-Type': 'application/json' }, withCredentials: true
  });
}

changePassword(passwordData: any) {
  return this.http.post(`${this.apiUrl}?action=changePassword`, passwordData, {
    headers: { 'Content-Type': 'application/json' }
  });
}

listMyDebates(userId: number, searchQuery: string = ''): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=listMyDebates&user_id=${userId}&search=${encodeURIComponent(searchQuery)}`);
}

listParticipatedDebates(userId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=listParticipatedDebates&user_id=${userId}`);
}

getPlatformStats(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getPlatformStats`);
}

getLeaderboard(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getLeaderboard`);
}

getMostControversialDebates(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getMostControversialDebates`);
}

getPopularTopics(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getPopularTopics`);
}

getRecentActivity(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getRecentActivity`);
}

sendFeedback(feedback: any): Observable<any> {
  const userId = localStorage.getItem('user_id'); // ✅ Retrieve user_id from localStorage

  return this.http.post(`${this.apiUrl}?action=submitFeedback`, { 
    user_id: userId, // ✅ Pass user_id from localStorage
    subject: feedback.subject,
    description: feedback.description
  });
}

getDebateArguments(debateId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getDebateArguments&debate_id=${debateId}`);
}

//ADMIN *****************************************************************************************************************************

getAllUsers(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getAllUsers`);
}

updateUserDetails(user: any): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=updateUser`, {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    bio: user.bio,
    date_of_birth: user.date_of_birth,
    location: user.location
  });
}

blockUser(userId: number, block: boolean): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=blockUser`, { user_id: userId, block });
}

getAllDebates(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getAllDebates`);
}

updateDebate(debateId: number, deadline: string, state: string): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=updateDebate`, { debate_id: debateId, deadline, state });
}

lockDebate(debateId: number, isLocked: boolean): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=lockDebate`, { debate_id: debateId, is_locked: isLocked });
}

getFeedback(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getFeedback`);
}

markFeedbackResolved(feedbackId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=resolveFeedback`, { feedback_id: feedbackId });
}

getAdminStats(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getAdminStats`);
}

getArguments(): Observable<any> {
  return this.http.get(`${this.apiUrl}?action=getArguments`);
}

archiveArgument(argumentId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}?action=archiveArgument`, { argumentId });
}


  
}