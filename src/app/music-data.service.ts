import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { mergeMap } from 'rxjs/operators';
import { environment } from './../environments/environment';
import { indexOf } from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class MusicDataService {

  // favouritesList : Array<any> = [];

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<SpotifyApi.ListOfNewReleasesResponse>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` }});
      }));
  }

  getArtistById(id: string): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleArtistResponse>(`https://api.spotify.com/v1/artists/${id}`, { headers: { "Authorization": `Bearer ${token}` }});
    }));
  
  }

  getAlbumsByArtistId(id): Observable<SpotifyApi.ArtistsAlbumsResponse> {
  
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.ArtistsAlbumsResponse>(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`, { headers: { "Authorization": `Bearer ${token}` }});
    }));
  }

  getAlbumById(id): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.SingleAlbumResponse>(`https://api.spotify.com/v1/albums/${id}`, { headers: { "Authorization": `Bearer ${token}` }});
    }));
  }

  searchArtists(searchString): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
      return this.http.get<SpotifyApi.ArtistSearchResponse>(`https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`, { headers: { "Authorization": `Bearer ${token}` }});
    }));
  }

  // addToFavourites(id): boolean {

  //   if(id == null || this.favouritesList.length >= 50){
  //     return false;
  //   }else{
  //     this.favouritesList.push(id);
  //     return true
  //   }
  // }

  // removeFromFavourites(id): Observable<any> { 

  //   this.favouritesList.splice(this.favouritesList.indexOf(id),1);
  //   return this.getFavourites();

  // }

  // getFavourites(): Observable<any> {
  //   return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
  //     if(this.favouritesList.length > 0){
  //       return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${this.favouritesList.join(',')}`, { headers: { "Authorization": `Bearer ${token}` }});
  //     }else if(this.favouritesList.length <= 0){
  //       return new Observable(o=>{o.next([])});
  //     }
  //     }));
  // }

  addToFavourites(id): Observable<[String]> {
    const access_token = localStorage.getItem("access_token");
    return this.http.put<[any]>(`${environment.userAPIBase}/favourites/${id}`, null, {headers: {"Authorization": `Bearer ${access_token}`}});
  }
  
  removeFromFavourites(id): Observable<any> {
    const access_token = localStorage.getItem("access_token");
    return this.http.delete<any>(`${environment.userAPIBase}/favourites/${id}`, {headers: {"Authorization": `Bearer ${access_token}`}}).pipe(mergeMap(favouritesArray => {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token => {
        if(favouritesArray.data.length > 0) {
          return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${favouritesArray.data.join(',')}`, { headers: { "Authorization": `Bearer ${token}` } });
        }else {
          return new Observable(o=>o.next({tracks: []}));
        }
      }))
    }));
  }
  
  getFavourites(): Observable<any> {
    const access_token = localStorage.getItem("access_token");
    return this.http.get<any>(`${environment.userAPIBase}/favourites/`, {headers: {"Authorization": `Bearer ${access_token}`}}).pipe(mergeMap(favouritesArray => {
        if(favouritesArray.data.length > 0){
          return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
            return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${favouritesArray.data.join(',')}`, { headers: { "Authorization": `Bearer ${token}` }});
          }));;
        }else{
          return new Observable(o=>o.next({tracks: []}));
        }
    }))
  }
}


