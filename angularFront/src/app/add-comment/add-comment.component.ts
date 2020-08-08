import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.less']
})
export class AddCommentComponent implements OnInit {
    @Input() movieId: string;
    @Output() fetchEvent = new EventEmitter();
    currentUser: User;
    commentForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
      this.authenticationService.currentUser.subscribe((value) => {
        this.currentUser = value;
      });
        this.commentForm = this.formBuilder.group({
            content: ['', Validators.required],
            anonymous: (false)
        });
    }
    get f() { return this.commentForm.controls; }

    private clearForm()
    {
      this.f.content.setValue('');
      this.loading = false;
      this.submitted = false;
    }

    onSubmit() {
        this.submitted = true;
        if (this.commentForm.invalid) {
            return;
        }
        if (!this.currentUser)
        {
          this.error = "You must be logged in to comment";
          return;
        }
        this.loading = true;
        this.apiService.postComment(this.movieId, { content: this.f.content.value, username: this.currentUser.username, anonymous: this.f.anonymous.value})
            .pipe(first())
            .subscribe(
                () => {
                  this.fetchEvent.emit();
                  this.clearForm();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}