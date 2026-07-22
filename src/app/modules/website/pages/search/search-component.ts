import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentPageComponent } from '../../../../shared/components/content-page/content-page.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ContentPageComponent],
  templateUrl: './search-component.html',
  styleUrls: ['./search-component.scss']
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  
  searchQuery: string = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
  }

  onLocalSearch(newQuery: string) {
    if (!newQuery || newQuery.trim() === '') return;
    
   
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: newQuery },
      queryParamsHandling: 'merge' 
    });
  }

  performSearch(query: string) {
    console.log("Time to call your backend API and search for:", query);
    // TODO: API 
  }
}
