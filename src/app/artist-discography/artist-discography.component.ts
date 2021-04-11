import { Component, OnInit, OnDestroy } from '@angular/core';
import * as albumData from '../data/SearchResultsAlbums.json'; 
import * as artistData from '../data/SearchResultsArtist.json';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css']
})
export class ArtistDiscographyComponent implements OnInit {

  constructor( private data: MusicDataService, private route: ActivatedRoute) { }

  albums = null;
  artist = {} as any;
  id = this.route.snapshot.params['id'];
  private adSub;
  

  ngOnInit(): void {
    this.adSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.data.getArtistById(this.id).subscribe(data => {
        this.artist = data;
      });

      this.data.getAlbumsByArtistId(this.id).subscribe(data => {
        this.albums = data.items.filter((item, index) => data.items.findIndex( item2 => 
            item.name == item2.name) === index
        )
      })
    })
  }

  ngOnDestroy(){
    this.adSub.unsubscribe();
  }

}
