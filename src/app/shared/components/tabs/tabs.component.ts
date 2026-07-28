// import { Component } from '@angular/core';

// import { CommonModule } from '@angular/common';
// // import { TabSchema } from '../../models/tab-schema';

// @Component({
//   selector: 'app-tabs',
//   imports: [],
//   templateUrl: './tabs.component.html',
//   styleUrl: './tabs.component.scss',
// })
// export class Tabs {}



// // 



// @Component({
//   selector: 'app-tabs',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './tabs.component.html',
//   styleUrl: './tabs.component.scss'
// })
// export class TabsComponent {

//   activeTab = 'services';

//   tabs: TabSchema[] = [
//     {
//       id: 'services',
//       title: 'Services',
//       icon: 'bi bi-grid'
//     },
//     {
//       id: 'downloads',
//       title: 'Downloads',
//       icon: 'bi bi-download'
//     },
//     {
//       id: 'announcements',
//       title: 'Announcements',
//       icon: 'bi bi-megaphone'
//     },
//     {
//       id: 'gallery',
//       title: 'Gallery',
//       icon: 'bi bi-images'
//     }
//   ];

//   selectTab(tab: TabSchema): void {
//     if (!tab.disabled) {
//       this.activeTab = tab.id;
//     }
//   }
// }