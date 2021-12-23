import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactUsForm: FormGroup;

  constructor() {}

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
    const message = {
      name: this.contactUsForm.get(['name'])?.value,
      email: this.contactUsForm.get(['email'])?.value,
      phone: this.contactUsForm.get(['phone'])?.value,
      subject: this.contactUsForm.get(['subject'])?.value,
      message: this.contactUsForm.get(['message'])?.value,
    };
    console.log(message);
  }
}
