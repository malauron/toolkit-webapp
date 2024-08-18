import { Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { IonSearchbar, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppParamsConfig } from 'src/app/Configurations/app-params.config';
import { User } from '../classes/user.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})

export class UsersPage implements OnInit, OnDestroy {
  @ViewChild('infiniteScroll') infiniteScroll;
  @ViewChild('searchBar') searchBar: IonSearchbar;
  // searchBar: IonSearchbar;
  searchSub: Subscription;
  userSub: Subscription;
  users: User[] = [];
  searchValue = '';
  pageNumber = 0;
  totalPages = 0;
  screenWidth: any;
  smallScreenWidth: number;
  isSmallWidth = false;
  isIonTitleVisible = true;
  isSearchbarVisible = true;
  isEndButtonsVisible = false;
  isFetching = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private navCtrl: NavController,
    private config: AppParamsConfig,
    private toastController: ToastController,
  ) { }

  ngOnInit() {

    this.smallScreenWidth = 575;
    this.screenWidth = window.innerWidth;
    this.setControls(true);

    this.getUsers(undefined, this.pageNumber, this.config.pageSize);

  }

  ionViewDidEnter(): void {
    setTimeout(() => {
      if (this.isSearchbarVisible) {
        this.searchBar.setFocus();
      }
    }, 5);
  }

  getUsers(
    event?,
    pageNumber?: number,
    pageSize?: number,
    searchDesc?: string
  ) {
    this.isFetching = true;

    this.usersService.getUsers(pageNumber, pageSize).subscribe({
      next: (res) => {
        this.users = this.users.concat(res.content);
        this.totalPages = res.totalPages;
        this.isFetching = false;
        if (event) {
          event.target.complete();
        }
        this.infiniteScroll.disabled = false;
      },
      error: (error) => { },
      complete: () => { }
    });

  }

  loadMoreData(event) {
    if (this.pageNumber + 1 >= this.totalPages) {
      event.target.disabled = true;
      return;
    }

    this.pageNumber++;

    if (this.searchValue) {
      this.getUsers(
        event,
        this.pageNumber,
        this.config.pageSize,
        this.searchValue
      );
    } else {
      this.getUsers(event, this.pageNumber, this.config.pageSize);
    }
  }

  async messageBox(messageDescription: string) {
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: messageDescription,
    });
    await toast.present();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.setControls(false);
  }

  setControls(initLoad: boolean) {
    if (this.screenWidth <= this.smallScreenWidth) {
      if (this.isSmallWidth && !initLoad) {
        return
      }
      this.isSmallWidth = true;
      this.isIonTitleVisible = true;
      this.isSearchbarVisible = false;
      this.isEndButtonsVisible = true;
    } else {
      if (!this.isSmallWidth && !initLoad) {
        return
      }
      this.isSmallWidth = false;
      this.isIonTitleVisible = true;
      this.isSearchbarVisible = true;
      this.isEndButtonsVisible = false;
    }
    console.log(this.isSmallWidth);
  }

  onSearchButtonClicked() {
    if (this.isSmallWidth) {
      this.isIonTitleVisible = false;
      this.isSearchbarVisible = true;
      this.isEndButtonsVisible = false;
      setTimeout(() => {
        this.searchBar.setFocus();
      }, 5);
    }
  }

  onBackButtonClicked() {
    if (this.isSmallWidth && this.isSearchbarVisible) {
      this.isIonTitleVisible = true;
      this.isSearchbarVisible = false;
      this.isEndButtonsVisible = true;
    } else {
      this.navCtrl.navigateBack('/');
    }
  }

  ngOnDestroy(): void {
    // this.searchSub.unsubscribe();
    // this.userSub.unsubscribe();
    console.log('Exiting page.');
  }

}
