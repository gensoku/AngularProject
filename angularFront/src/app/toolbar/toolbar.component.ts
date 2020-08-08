import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.less']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  currentUser: User;

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((value) => {
      this.currentUser = value;
    });
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

  toto(): void {
    this.router.navigate(['/home']);
  }
}
