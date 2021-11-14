import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessAuthGuard } from './access-auth.guard';
import { ActivityComponent } from './activity/activity.component';
import { AddPostComponent } from './add-post/add-post.component';
import { AnotherUserComponent } from './another-user/another-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { InboxComponent } from './inbox/inbox.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';


const routes: Routes = [

  {
    path:'login',component:LoginComponent
  },
  {
    path:'signup',component:SignupComponent
  },
  {
    path:"dashboard",canActivate:[AccessAuthGuard],component:DashboardComponent,
    children:[

      {path:"home",component:HomeComponent},
      {path:"explore",component:ExploreComponent},
      {path:"profile",component:ProfileComponent},
      {path:"addPost",component:AddPostComponent},
      {path:"inbox",component:InboxComponent},
      {path:"activity",component:ActivityComponent},
      {path:"anotherUser/:id",component:AnotherUserComponent},

    ]

  },
  {
    path:"main",component:MainComponent
  },
  {
    path:"",redirectTo:"/main",pathMatch:"full"
  },
  
  { 
    path:"**",component:NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
