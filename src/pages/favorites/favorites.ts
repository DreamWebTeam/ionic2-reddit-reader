import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { PostsPage } from '../posts/posts';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
  providers: [Storage]
})
export class FavoritesPage {
  private storage: Storage;
  favorites: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, storage: Storage) {
  	this.storage = storage;
  }

  ionViewWillEnter() {
    this.getFavorites();    
  }

  getFavorites() {
    this.storage.get('favorites').then((favoritesList) => {
      if (favoritesList){
      	this.favorites = favoritesList;
      }
    });
  };

  goToSubreddit(subreddit) {
    this.navCtrl.push(PostsPage, {subreddit});
  }

}
