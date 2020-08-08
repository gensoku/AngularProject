import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.less']
})

export class CommentComponent implements OnInit {
  panelOpenState: boolean = false;
  @Input() movieId: string;
  comments: any = [];
	constructor(private apiService: ApiService) { }

	ngOnInit() {
      this.fetchComments();
  }

  fetchComments() {
    this.apiService.getComments(this.movieId).subscribe((data: any[])=>{
			this.comments = data;
    })
  }

}
