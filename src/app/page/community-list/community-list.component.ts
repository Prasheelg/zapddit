import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, liveQuery } from 'dexie';
import { Community } from 'src/app/model/community';
import { NdkproviderService } from 'src/app/service/ndkprovider.service';
import { CommunityService } from '../../service/community.service';
import { ObjectCacheService } from 'src/app/service/object-cache.service';

const BUFFER_REFILL_PAGE_SIZE = 100;
const BUFFER_READ_PAGE_SIZE = 20;

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent {

  communities?:Community[];
  allCommunities?:Observable<Community[]>;
  until: number | undefined = Date.now();
  limit: number | undefined = BUFFER_REFILL_PAGE_SIZE;
  loadingEvents: boolean = false;
  loadingNextEvents: boolean = false;
  reachedEndOfFeed : boolean = false;
  nextEvents: Community[] | undefined;
  isLoggedInUsingPubKey:boolean = false;
  showOnlyOwnedCommunities: boolean = false;
  showOnlyJoinedCommunities: boolean = false;
  showOnlyModeratingCommunities:boolean = false;
  showCreateCommunity:boolean = false;

  constructor(public ndkProvider:NdkproviderService, private router:Router,
     private communityService:CommunityService, private objectCache:ObjectCacheService){

  }

  ngOnInit(){
    const url = this.router.url;
    if(url.indexOf('/own')>-1){
      this.showOnlyOwnedCommunities = true;
    }

    if(url.indexOf('/joined')>-1){
      this.showOnlyJoinedCommunities = true;
    }

    if(url.indexOf('/moderating')>-1){
      this.showOnlyModeratingCommunities = true;
    }

    this.ndkProvider.isLoggedInUsingPubKey$.subscribe(val => {
      this.isLoggedInUsingPubKey = val;
    });
    this.fetchCommunities();
  }

  onLeave(community:any){
    let cardToRemove = community as Community
    const listAfterDelete = this.communities?.filter((c)=> c.id !== cardToRemove.id);
    this.communities = listAfterDelete;
  }

  async fetchCommunities(){
    try{
      this.loadingEvents = true;
      if(this.showOnlyJoinedCommunities){
        this.communities = await this.fetchJoinedCommunities();
      } else if (this.showOnlyModeratingCommunities){
        this.communities = await this.ndkProvider.fetchCommunities(this.limit, undefined, this.until,undefined, this.showOnlyModeratingCommunities);
      } else if (this.showOnlyOwnedCommunities){
        this.communities = await this.ndkProvider.fetchCommunities(this.limit, undefined, this.until, this.showOnlyOwnedCommunities);
      }
      else {
        await this.ndkProvider.fetchCommunities();
        this.communities = await this.objectCache.communities.toArray();
      }
    } catch (err){
      console.error(err);
    } finally{
      this.loadingEvents = false;
    }
  }

  async fetchJoinedCommunities():Promise<Community[]>{
      var fromStandardSource = await this.communityService.fetchJoinedCommunities();
      var fromAppSource =  await this.ndkProvider.fetchJoinedCommunities();
      var deDuplicated = this.communityService.deDuplicateCommunities([...fromStandardSource].concat(fromAppSource));
      return deDuplicated;
  }


  onCloseCreateCommunity($event:any){
    this.showCreateCommunity = false;
    if($event){
      this.ngOnInit();
    }
  }
}
