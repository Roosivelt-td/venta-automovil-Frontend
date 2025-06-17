import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {App} from './app/app';
//import { AppComponent } from './app/app.component';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
//bootstrapApplication(AppComponent, appConfig)
 // .catch((err) => console.error(err));
