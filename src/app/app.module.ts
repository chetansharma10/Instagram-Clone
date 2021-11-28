import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



//Start Firebase Section
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { LoadingComponent } from './loading/loading.component';
import { PostComponent } from './post/post.component';
import { AnotherUserComponent } from './another-user/another-user.component';
import { ProfileComponent } from './profile/profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ExploreComponent } from './explore/explore.component';
import { ActivityComponent } from './activity/activity.component';
import { AddPostComponent } from './add-post/add-post.component';
import { InboxComponent } from './inbox/inbox.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ErrorHandlerComponent } from './error-handler/error-handler.component';
//End  Firebase Section


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    DashboardComponent,
    NotFoundComponent,
    HomeComponent,
    LoadingComponent,
    PostComponent,
    AnotherUserComponent,
    ProfileComponent,
    SpinnerComponent,
    NavBarComponent,
    ExploreComponent,
    ActivityComponent,
    AddPostComponent,
    InboxComponent,
    ErrorHandlerComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PickerModule,
 

    //Initialize App
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage,
    NgxSkeletonLoaderModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
