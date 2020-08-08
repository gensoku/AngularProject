import { Component, OnInit } from '@angular/core';  
import { FilterParams } from '../models/filters';
import { AlertService } from '../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genres } from '../models/movie';
  
@Component({  
	selector: 'app-home',  
	templateUrl: './home.component.html',  
	styleUrls: ['./home.component.less']  
})  
export class HomeComponent implements OnInit {
	filters: FilterParams = {};
	genres: String[] = [];
	searchForm: FormGroup;
	submitted: boolean = false;
	error = '';

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService
    ) {}

	ngOnInit() {
        Object.keys(Genres).map((key) => this.genres.push(key));
        this.searchForm = this.formBuilder.group({
			genre: (''),
            sort: (''),
			yearMin: (''),
			yearMax: ('')
        });	
	}

	get f() { return this.searchForm.controls; }

	onSubmit() {
        this.submitted = true;
        this.alertService.clear();
		if (this.searchForm.invalid) { return;}
		if (this.f.genre.value) {
			this.filters = {...this.filters, genre: this.f.genre.value};
		}
    }
}

