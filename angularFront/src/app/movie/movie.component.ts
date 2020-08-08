import { Component, OnInit, Input, SimpleChanges } from '@angular/core';  
import { ApiService } from '../services/api.service';
import { FilterParams } from '../models/filters';


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.less']
})
export class MovieComponent implements OnInit {
	@Input() filters: FilterParams;
	 movies = [];
	 
	constructor(private apiService: ApiService) { }
	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
		this.fetchMovies();
	  }

	public fetchMovies() {
		this.apiService.getMovies(this.filters).subscribe((data: any[])=>{
			this.movies = data;
		})
	}
}

