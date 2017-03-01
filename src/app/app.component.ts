import { Component, ViewChild  } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { PostsPage } from '../pages/posts/posts';
import { FavoritesPage } from '../pages/favorites/favorites'


@Component({
  templateUrl: 'app.html'
})
export class RedditReaderApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PostsPage;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Posts', component: PostsPage },
      { title: 'Subreddit', component: FavoritesPage }
    ];

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
