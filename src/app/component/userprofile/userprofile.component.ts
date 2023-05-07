import { Component } from '@angular/core'
import { type NDKUserProfile } from '@nostr-dev-kit/ndk'
import { NdkproviderService } from 'src/app/service/ndkprovider.service'

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent {
  ndkProvider: NdkproviderService
  constructor (ndkProvider: NdkproviderService) {
    this.ndkProvider = ndkProvider
  }

  isLoggedIn (): boolean {
    return this.ndkProvider.isLoggedIn()
  }

  isProfileLoaded (): boolean {
    return this.ndkProvider.currentUserProfile !== undefined
  }

  getCurrentUserProfile (): NDKUserProfile | undefined {
    return this.ndkProvider.getCurrentUserProfile()
  }
}
