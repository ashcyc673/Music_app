import { Component, OnInit } from '@angular/core';
import * as data from '../data/SearchResultsAlbum.json';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  constructor(private data: MusicDataService, private bar: MatSnackBar, private route: ActivatedRoute) { }

  album = {} as any;
  id = this.route.snapshot.params['id'];
  private albumSub;

  ngOnInit(): void {
    this.albumSub = this.route.params.subscribe(params => {
      this.id = params['id'];      
      this.data.getAlbumById(this.id).subscribe(data => {
        this.album = data;
      })
    });
  }

  // favourites(id) {
  //   if(this.data.addToFavourites(id)) {
  //       this.bar.open("Adding to Favourites...", "Done", { duration: 1500 });
  //   }else{
  //     this.bar.open("Unable to add song to Favourites", "Done", { duration: 1500});
  //   }
  // }

  favourites(id) {
    this.data.addToFavourites(id).subscribe({
      next: () => this.bar.open("Adding to Favourites...", "Done", { duration: 1500 }),
      error: () => this.bar.open("Unable to add song to Favourites", "Done", { duration: 1500})
    });
  }

  ngOnDestory() {
    this.albumSub.unsubscribe();
  }

}
