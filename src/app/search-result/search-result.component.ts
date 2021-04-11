import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  constructor(private data: MusicDataService, private route: ActivatedRoute) { }

  results: any;
  searchQuery: any;
  q : any;
  private srSub;

  ngOnInit(): void {
    this.srSub = this.route.queryParams.subscribe(params => {
      this.q = params['q'];
      this.data.searchArtists(this.q).subscribe(data => {
        this.results = data.artists.items.filter(artist => artist.images.length > 0)
      })
    })
  }

  ngOnDestroy() {
    this.srSub.unsubscribe();
  }

}
