import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {

    private titleService = inject(Title);
  private translate = inject(TranslateService);

  constructor() {
    this.translate.stream('Header.HeadLine').subscribe((title: string) => {
      if (title && title !== 'Header.HeadLine') {
        this.titleService.setTitle(title);
      }
    });
  }
}