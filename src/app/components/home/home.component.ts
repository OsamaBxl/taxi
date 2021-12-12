import { Component, OnInit } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateBookingService } from 'src/app/services/validate-booking.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  choiceTaxi = 'standard';
  phoneCode = '+32';
  payment = 'cash';
  faHandHoldingUsd = faHandHoldingUsd;
  faSmileBeam = faSmileBeam;
  faVirus = faVirusSlash;
  faFeatherAlt = faFeatherAlt;
  faCcVisa = faCcVisa;

  //Form validation
  formValidate = new FormGroup({
    fullName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    pickUp: new FormControl(null, [Validators.required]),
    phoneCode: new FormControl(null, [Validators.required]),
    otherAddressPick: new FormControl(null),
    otherAddressDrop: new FormControl(null),
    dropOff: new FormControl(null, [Validators.required]),
    suitecase: new FormControl(null, [Validators.required]),
    persons: new FormControl(null, [Validators.required]),
    choiceTaxi: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required]),
    payment: new FormControl(null, [Validators.required]),
    additionalInfo: new FormControl(null),
  });

  constructor(private validateBooking: ValidateBookingService) {}

  ngOnInit(): void {
    this.onFormSubmit(this.formValidate);
    this.onValidateFromBackEnd();
  }

  onValidateFromBackEnd() {
    this.validateBooking
      .validateBooking(this.formValidate.value)
      .subscribe((data) => {
        console.log(data);
      });
  }

  onFormSubmit(formValue: any) {
    let phoneNumber =
      this.formValidate.value.phoneCode + this.formValidate.value.phoneNumber;

    if (phoneNumber[3] == '0') {
      phoneNumber = phoneNumber.replace('0', '');
    }
    // console.log(phoneNumber);
  }
}
