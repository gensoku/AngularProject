import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';


@Component({  
	selector: 'app-register',  
	templateUrl: 'register.component.html',  
	styleUrls: ['register.component.less']  
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading:boolean = false;
    submitted: boolean = false;
    error = '';
    hideP: boolean = true;
    hideC: boolean = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            passwordConf: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    get f() { return this.registerForm.controls; }

    getErrorEmail() {
        if (this.f.email.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.f.email.hasError('email') ? 'Not a valid email' : '';
      }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.f.passwordConf.value !== this.f.password.value) { return ;}
        if (this.registerForm.invalid) { return;}
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.error = error;
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}