// import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
// // import { AuthService } from '../../core/auth/auth.service';


// @Directive({
//   selector: '[appHasRole]'
// })
// export class HasRoleDirective {
// private hasView = false;

//   @Input() set appHasRole(role: string) {
//     if (this.authService.hasRole(role)) {
//       if (!this.hasView) {
//         this.vcRef.createEmbeddedView(this.tpl);
//         this.hasView = true;
//       }
//     } else {
//       this.vcRef.clear();
//       this.hasView = false;
//     }
//   }

//   constructor(
//     private tpl: TemplateRef<any>, 
//     private vcRef: ViewContainerRef, 
//     // private authService: AuthService
//   ) {}
// }
