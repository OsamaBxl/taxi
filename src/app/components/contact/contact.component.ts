import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
              private _notify:NotificationService) {}

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
        this._notify.openSnackbar('Success' , SnackBarState.Success , 5000)
      },err=>this._notify.openSnackbar('Error' , SnackBarState.Error , 5000));
    }
  }
}
