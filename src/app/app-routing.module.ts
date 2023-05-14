import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { EventFeedComponent } from './component/event-feed/event-feed.component';
import { SinglePostComponent } from './component/single-post/single-post.component';
import { PreferencesPageComponent } from './component/preferences-page/preferences-page.component';
import { FollowersComponent } from './component/followers/followers.component';

const routes: Routes = [
  { path: 't/:topic', component: EventFeedComponent },
  { path: 'followers', component: FollowersComponent },
  { path: 'n/:eventid', component: SinglePostComponent },
  { path: '',   redirectTo: '/feed', pathMatch: 'full' }, // redirect to `first-component`
  { path: 'preferences', component: PreferencesPageComponent},
  { path: 'feed', component: EventFeedComponent },
  { path: '**', component: EventFeedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
