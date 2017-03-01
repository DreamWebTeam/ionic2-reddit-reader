import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

import { RedditApiService } from '../../providers/reddit-api-service';
import { CommentsPage } from '../comments/comments'
import { FavoritesPage } from '../favorites/favorites'

@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
  providers: [RedditApiService, Storage]
})
export class PostsPage {
  loadCompleted: boolean = false;
  subredditIsFavorited: boolean = false;
  subreddit;
  private storage: Storage;
  posts: Array<any>;
  commentsPage = CommentsPage;

  constructor(public navCtrl: NavController, public redditApi: RedditApiService, public navParams: NavParams, storage: Storage, public alertCtrl: AlertController) {
    this.storage = storage;
    this.subreddit = this.navParams.get('subreddit');
    this.load(this.subreddit);
  }

  load(url?,) {
    if (this.subreddit){
      this.checkIfFavorited();
    }
    this.redditApi.fetch(url).subscribe(
      posts => { this.posts = posts;  },
      err => {
        this.posts = []; 
        this.loadCompleted = true;
        this.showErrorAlert();
      },
      () => { this.loadCompleted = true; }
     );
      console.log(this.posts)
  }

  refreshPosts(refresher){
    var url : string = '';
    if (this.subreddit){
      url = this.subreddit;
    }
    this.redditApi.fetch(url).subscribe(
      posts => { this.posts = posts;  },
      err => {
        this.posts = []; 
        this.loadCompleted = true;
        this.showErrorAlert();
      },
      () => { 
        this.loadCompleted = true;
        refresher.complete();
      }
    );
  }

  getPostImage(post) {
   let postImage = '';
   if (!post.imageError && post.preview) {
     postImage = post.preview.images[0].source.url;
   }
   return postImage;
  }

  setImageError(post) {
    post.imageError = true;
  }

  readPost(post) {
    let redditUrl = 'https://www.reddit.com/r/';
    if (post.url.includes(redditUrl)) {
      this.goToComments(post)
    } else {
      this.goToPost(post);
    }
  }

  goToComments(post) {
    this.navCtrl.push(this.commentsPage, {post})
  }

  goToPost(post) {
    window.open(post.url, '_blank');
  }

  goToSubreddit(subreddit) {
    this.navCtrl.push(PostsPage, {subreddit})
  }

  goToFavoritesPage() {
    this.navCtrl.push(FavoritesPage);
  }

  loadMore(infiniteScroll) {
    let lastPost = this.posts[this.posts.length - 1];
    if (!lastPost) {
      infiniteScroll.complete()
    } else {
      this.redditApi.fetchNext(lastPost.name, this.subreddit).subscribe((posts) => {
        this.posts = this.posts.concat(posts);
        infiniteScroll.complete();
      })
    }
  }

  addToFavorites():void {
    this.storage.get('favorites').then((favoritesList) => {
      if (favoritesList){
        if(favoritesList.indexOf(this.subreddit) == -1){ // check if subreddit exist in favoritesList 
          favoritesList.push(this.subreddit);
        }
      }else{
        favoritesList=[this.subreddit]; // initialize favoritesList 
      }
      this.storage.set('favorites', favoritesList);
      this.subredditIsFavorited = true;
    }).catch((ex) => {
       console.log("Exception",ex);
    });
  }

  removeFromFavorites():void {
    this.storage.get('favorites').then((favoritesList) => {
      if (favoritesList){
       var index = favoritesList.indexOf(this.subreddit); // find index of subreddit in favoritesList 
        if(index > -1){                       
          favoritesList.splice(index,1);
          this.storage.set('favorites', favoritesList);
        }
      }
      this.subredditIsFavorited = false;
    }).catch((ex) => {
       console.log("Exception",ex);
    });
  }

  checkIfFavorited(): void {
    this.storage.get('favorites').then((favoritesList) => {
      if (favoritesList){
        if(favoritesList.indexOf(this.subreddit) > -1){ // check if subreddit exist in favoritesList 
          this.subredditIsFavorited = true;
        }
      }      
    }).catch((ex) => {
       console.log("Exception",ex);
    });
  }

  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Fetching Posts Error',
      subTitle: 'No posts retrieved!',
      buttons: ['OK']
    });
    alert.present();
  }
}
