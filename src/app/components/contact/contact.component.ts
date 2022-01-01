import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';
import { SendEmailService } from 'src/app/services/send-email.service';
import { SnackBarState } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactUsForm: FormGroup;

  constructor(private sendMessage: SendEmailService,
              private _notify:NotificationService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.contactUsForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      subject: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required),
    });
  }

  sendMail() {
    if (this.contactUsForm.valid) {
      const message = {
        name: this.contactUsForm.get(['name'])?.value,
        email: this.contactUsForm.get(['email'])?.value,
        phone: this.contactUsForm.get(['phone'])?.value,
        subject: this.contactUsForm.get(['subject'])?.value,
        message: this.contactUsForm.get(['message'])?.value,
      };
      this.sendMessage.sendEmail(message).subscribe(() => {
        this.contactUsForm.reset();
        if(localStorage.getItem('currentLang') == 'en'){
          this.translate.use('en').subscribe((data)=>{
            this._notify.openSnackbar(data.SUCCESS , SnackBarState.Success , 5000)
          })
        }else if(localStorage.getItem('currentLang') == 'fr'){
          this.translate.use('fr').subscribe((data)=>{
            this._notify.openSnackbar(data.SUCCESS , SnackBarState.Success , 5000)
          })
        }else if(localStorage.getItem('currentLang') == 'nl'){
          this.translate.use('nl').subscribe((data)=>{
            this._notify.openSnackbar(data.SUCCESS , SnackBarState.Success , 5000)
          })
        }
      },err=>{
        if(localStorage.getItem('currentLang') == 'en'){
          this.translate.use('en').subscribe((data)=>{
            this._notify.openSnackbar(data.ERROR , SnackBarState.Success , 5000)
          })
        }else if(localStorage.getItem('currentLang') == 'fr'){
          this.translate.use('fr').subscribe((data)=>{
            this._notify.openSnackbar(data.ERROR , SnackBarState.Success , 5000)
          })
        }else if(localStorage.getItem('currentLang') == 'nl'){
          this.translate.use('nl').subscribe((data)=>{
            this._notify.openSnackbar(data.ERROR , SnackBarState.Success , 5000)
          })
        }
      });
    }
  }
}
