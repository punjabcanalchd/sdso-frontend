import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { ApiService } from "../services/api.service";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated$ = new BehaviorSubject<boolean | null>(null);
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private baseUrl = 'http://localhost:8000';
  private apiUrl = `${this.baseUrl}/api`;

  constructor(
    private api: ApiService,
    private router: Router,
    private http: HttpClient
  ) { }

  /**
   * Current login state
   */
  get isLoggedIn(): boolean {
    return this.authenticated$.value === true;
  }

  /**
   * Initialize auth on app startup
   */
  initAuth(): Observable<boolean> {
    return this.api.get<any>('/auth/user').pipe(
      tap((response) => {
        this.userSubject.next(response.user);
        this.authenticated$.next(true);
      }),
      map(() => true),
      catchError(() => {
        this.userSubject.next(null);
        this.authenticated$.next(false);
        return of(false);
      })
    );
  }

  /**
   * Login
   */
  login(data: any): Observable<any> {
    return this.api.post<any>('/auth/login', data).pipe(
      tap((response) => {
        // Read the user directly from the login response to prevent race conditions!
        if (response.user) {
          this.userSubject.next(response.user);
          this.authenticated$.next(true);
        }
      })
    );
  }
  /**
   * Update User Profile
   */
  getProfile(): Observable<any> {
    return this.api.get<any>('/auth/profile');
  } 
  updateProfile(data: FormData): Observable<any> {
    return this.api.post<any>('/auth/profile', data).pipe(
      tap((response) => {
        // Update local state automatically if the backend returns the new user object
        if (response.user) {
          this.userSubject.next(response.user);
        }
      })
    );
  }
  /**
   * Change Password
   */
  changePassword(payload: any): Observable<any> {
    return this.api.post<any>('/auth/changePassword', payload);
  }

  /**
   * Load captcha
   */
  loadCaptcha(): Observable<{
    image: string;
    captchaId: string;
  }> {
    return this.api.post('/auth/getCaptcha', {}).pipe(
      map((res: any) => ({
        captchaId: res.data.captcha_id,
        image: res.data.captcha_image
      }))
    );
  }

  /**
   * Logout
*/
  logout(): void {
    this.api.post('/auth/logout', {}).subscribe({
      next: () => { },
      error: () => { }
    });
    this.authenticated$.next(false);
    this.userSubject.next(null);
    this.router.navigateByUrl('/auth/login');
  }





  /**
   * Send OTP - Using ApiService consistently
   */
  sendOtp(mobileNumber: string): Observable<any> {
    const formData = new FormData();
    formData.append('mobileNumber', mobileNumber);

    console.log('Sending OTP to:', '/auth/sendOtp');
    console.log('With mobile:', mobileNumber);

    // Use ApiService instead of direct HttpClient
    return this.api.post('/auth/sendOtp', formData);
  }

  /**
   * Verify OTP - Using ApiService consistently
   */
  verifyOtp(payload: any): Observable<any> {
    console.log('Verifying OTP at:', '/auth/verifyOtp');
    console.log('With payload:', payload);

    // Use ApiService instead of HttpClient
    return this.api.post('/auth/verifyOtp', payload);
  }

  /**
   *  Register API- 
   */
  register(payload: any): Observable<any> {
    return this.api.post('/auth/register', payload);
  }

  /**
   * Auth observable
   */
  isAuthenticated$(): Observable<boolean> {
    return this.authenticated$.pipe(
      filter((v): v is boolean => v !== null)
    );
  }

  getDashboardRoute(): string {
    const role = (this.userSubject.value?.roleSlug );

    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'operator':
        return '/operator/dashboard';
      // case 'applicant':
        // return '/account/dashboard';
      default:
        return '/';
    }
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.roleSlug === role;
  }

  getUsers(data: any): Observable<any> {
    return this.api.get<any>('/admin/users', data);
  }

  getUserByPublicId(publicId: string): Observable<any> {
    return this.api.get<any>(`/admin/users/${publicId}`);
  }

  createUser(payload: any) {
    return this.api.post('/admin/users',payload);
  }

  updateUser(publicId: string, payload: any): Observable<any> {
    return this.api.post<any>(`/admin/users/${publicId}/updateStatus`, payload);
  }

  updateEmailAndPhone(publicId: string, payload: FormData): Observable<any> {
    return this.api.post<any>(`/admin/users/${publicId}/email-update`, payload);
  }

  getEmailAndPhoneLogs(publicId: string): Observable<any> {
    return this.api.get<any>(`/admin/users/${publicId}/email-logs`);
  }
  
  getDistricts(data?: any): Observable<any> {
    return this.api.get<any>('/admin/districts', data);
  }

  getRoles(data: any): Observable<any> {
    return this.api.get<any>('/admin/roles', data);
  }

  createRole(payload: any) {
    return this.api.post('/admin/roles', payload);
  }

  getPermissions(data: any): Observable<any> {
    return this.api.get<any>('/admin/permissions/tree', data);
  }

  getRolePermissionsTree(roleId: string | number): Observable<any> {
    return this.api.get<any>(`/admin/roles/${roleId}/permissions/tree`);
  }

  updateRole(id: string | number, payload: any): Observable<any> {
    return this.api.post<any>(`/admin/roles/${id}/update`, payload);
  }

  syncRolePermissions(roleId: string | number, permissions: string[]): Observable<any> {
    return this.api.post<any>(`/admin/roles/${roleId}/permissions`, { permissions });
  }

  getPages(payload:any): Observable<any>{
    return this.api.get<any>(`/admin/pages`, payload);
  }

  getStates(data: any): Observable<any> {
    return this.api.get<any>('/admin/states', data);
  }

  createState(payload: any) {
    return this.api.post('/admin/states',payload);
  }

  updateState(stateId: string, payload: any): Observable<any> {
    return this.api.post<any>(`/admin/states/${stateId}/update`, payload);
  }

  getOfficeHierarchy(data: any): Observable<any> {
    return this.api.get<any>('/admin/office_hierarchy', data);
  }

  getDesignations(data: any): Observable<any> {
    return this.api.get<any>('/admin/designation', data);
  }

  getCircles(data: any): Observable<any> {
    return this.api.get<any>('/admin/circles', data);
  }

  getDivisions(data: any): Observable<any> {
    return this.api.get<any>('/admin/divisions', data);
  }

  getSubDivisions(data: any): Observable<any> {
    return this.api.get<any>('/admin/subdivisions', data);
  }

  getOffices(data: any): Observable<any> {
    return this.api.get<any>('/admin/offices', data);
  }
}