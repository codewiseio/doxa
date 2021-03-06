import { Observable } from "rxjs/Rx"
import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';


import { User } from '../models/user';
import { environment } from '../../../../environments/environment';

export const TOKEN_NAME: string = 'authToken';

@Injectable()
export class AuthenticationService {

  api: any = environment.api;

  constructor(private http: HttpClient ) { }


  /**
   * Provide the generated account activation key to enable new accounts.
   * @param  {string}          key Key sent to user via email
   * @return {Observable<any>}   
   */
  activateAccount(key: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(`${this.api}/authentication/`, { key: key }, { headers: headers} );
  }

  login(username: string, password: string) {

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let data = { username: username, password: password };

      return this.http
        .post(`${this.api}/authentication/`, data, { headers: headers } )
           .toPromise()
           .then(
             (response: any) => {
                // login successful if there's a jwt token in the response
                console.log('Login successful');
                localStorage.setItem('currentUser', JSON.stringify(response));
                localStorage.setItem(TOKEN_NAME,response.token)
                return response as User;
             }
            )
  }

  /**
   * Edit a users login information.
   *
   * Accepts changes to 'email' and 'password'. Must confirm password with 
   * 'confirm' password for changes to be accepted.
   * 
   * @param {number}   userId ID of User record to update
   * @param {object}   data   Object containing 'email' or 'password', and obligatory 'confirm_password' fields
   */
  modifyCredentials(userId: number, data: { email?: string, password?: string, confirm_password: string}) {
      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.patch(`${this.api}/users/${userId}/`, data, { headers: headers} );
  }

  /**
   * Register a new user
   * @param  {User}    user The user data for registration
   * @return {Promise}      
   */
  register(user: User): Promise<void | User[]> {

      let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http
        .post(`${this.api}/users/`, user, { headers: headers } )
           .toPromise()
           .then(response => response as User[])
  }


  /**
   * Reset a user's password using the unique key sent to them via email.
   * 
   * @param {string} key  The key which allows the password reset
   * @param {string} password  The new password to use
   * @return {Observable<any>}  
   */
  resetPassword(key: string, password: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .patch(`${this.api}/authentication/password/${key}/`, {password: password},  { headers: headers } );
  }

  /**
   * Send a password reset link to the specified email
   * 
   * @param  {string}          email Email to send password reset link
   * @return {Observable<any>}       
   */
  resetPasswordRequest(email: string): Observable<any> {
    	return this.http
        .post(`${this.api}/authentication/password/`, { email: email });
  }


  /**
   * Poll the server to confirm that an email is valid and unique.
   *
   * You can optionally specify a user id. If the supplied email belongs
   * to this user, the email will not be flagged as invalid for being
   * in use. 
   *
   * Returns { valid: true } if email is valid
   * Returns { valid: false } if email is not valid
   *
   * 
   * @param  {string}          email  Email to test
   * @param  {number}          userid Returns true if the email is 
   * @return {Observable<any>}        [description]
   */
  validateEmail(email: string, userid?: number ): Observable<any> {
    let params = new HttpParams().set('email', email );
    if ( userid )
       params = params.set('userid', userid.toString() );
    return this.http.get(`${this.api}/authentication/email/`, { params: params }  );
  }

  /**
   * Validate a password reset request. 
   *
   * When a user arrives to the password reset page via the provided link, 
   * we perform validation on the reset password key to check if the link
   * is valid, expired, or already been used.
   * 
   * @param  {string}          key Unique key to validate
   * @return {Observable<any>}     
   */
  validateResetPasswordRequest(key: string): Observable<any> {
    return this.http
        .get(`${this.api}/authentication/password/${key}/`);
  }

}
