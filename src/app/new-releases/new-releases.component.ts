import { Component, OnInit, OnDestroy} from '@angular/core';
import * as data from '../data/NewReleasesAlbums.json';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.css']
})
export class NewReleasesComponent implements OnInit {

  constructor(private data: MusicDataService) { }
  releases = [];
  
  private newReleaseSub:any;

  ngOnInit(): void {
    this.newReleaseSub = this.data.getNewReleases().subscribe(data => {
      this.releases = data.albums.items;
    });
  }

  ngOnDestroy(){
    this.newReleaseSub.unsubscribe();
  }
}
