import { Component, OnInit, Output } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ValidateBookingService } from 'src/app/services/validate-booking.service';
import { BOOkingData } from 'src/app/interfaces/booking-data';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';

import {
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import PhoneNumber from 'awesome-phonenumber';
import { ISO_3166_1_CODES } from './country-codes';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Output() checkoutID: string;

  choiceTaxi = 'standard';
  seigeEnfant = 'no';
  // country = '+32';
  payment = 'cash';
  vol: 0;
  faHandHoldingUsd = faHandHoldingUsd;
  faSmileBeam = faSmileBeam;
  faVirus = faVirusSlash;
  faFeatherAlt = faFeatherAlt;
  faCcVisa = faCcVisa;

  myPlaces = [];
  estimationCost: number = 0;

  //Form validation
  formValidate = new FormGroup({
    fullName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    number: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(11),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    country: new FormControl(null, [Validators.required]),
    vol: new FormControl(null),
    seigeEnfant: new FormControl(null),
    from: new FormControl(null),
    to: new FormControl(null),
    suitecase: new FormControl(null, [Validators.required]),
    persons: new FormControl(null, [Validators.required]),
    choiceTaxi: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required]),
    payment: new FormControl(null),
    additionalInfo: new FormControl(null),
  });

  DistanceText: string;
  DistanceValue: number;
  durationText: string;
  durationValue: number;
  estimatedPrice: number;
  from: string;
  to: string;

  constructor(
    private validateBooking: ValidateBookingService,
    private _notify: NotificationService,
    private fb: FormBuilder
  ) {}

  //Code for Phone number (angular material)
  countyCodes = ISO_3166_1_CODES;
  profileForm = this.fb.group({
    phone: this.fb.group(
      {
        country: ['+32'],
        number: [''],
        code_name: ['BE'],
      },
      { validators: phoneValidator }
    ),
  });
  phoneErrorMatcher = new PhoneErrorMatcher();

  /**
   * Return a string containing only numeric values from the
   * phone.number form field.
   */
  get phoneNumberDigits(): string {
    return this.phoneNumberControl.value.replace(/\D/g, '');
  }

  /**
   * Return an {@see PhoneNumber} value created from the
   * phoneNumberDigits and currently selected country code.
   */
  get phoneNumber(): PhoneNumber {
    return new PhoneNumber(
      this.phoneNumberDigits,
      this.phoneCountryControl.value
    );
  }

  /**
   * Formats the phone number digits using the 'national' format
   * from awesome-phonenumber.
   */
  formatNumber() {
    const natNum = this.phoneNumber.getNumber('national');
    this.phoneNumberControl.setValue(natNum ? natNum : this.phoneNumberDigits);
  }

  /**
   * Generate a hint using the {@see PhoneNumber} getExample method
   * with the currently selected country.
   */
  get phoneHint(): string {
    return PhoneNumber.getExample(this.phoneNumberCodeName.value).getNumber(
      'national'
    );
  }

  /**
   * Get the [E.164]{@link https://en.wikipedia.org/wiki/E.164} formatted
   * phone number typically required by systems for making calls and
   * sending text messages.
   */
  get phoneE164(): string {
    return this.phoneNumber.getNumber('e164');
  }

  // FormControl Getters
  get phoneGroup() {
    return this.profileForm.get('phone') as FormControl;
  }

  get phoneCountryControl() {
    return this.profileForm.get('phone.code_name') as FormControl;
  }

  get phoneNumberControl() {
    return this.profileForm.get('phone.number') as FormControl;
  }
  get phoneNumberCodeName() {
    return this.profileForm.get('phone.code_name') as FormControl;
  }

  ngOnInit(): void {}

  onFormSubmit() {
    if (this.formValidate.valid) {
      let number =
        this.formValidate.value.country + this.formValidate.value.number;

      if (number[3] == '0') {
        number = number.replace('0', '');
      }

      const newBooking: BOOkingData = {
        fullName: this.formValidate.get(['fullName'])?.value,
        country: this.profileForm.get(['phone'])?.value.country,
        number: this.profileForm.get(['phone'])?.value.number,
        email: this.formValidate.get(['email'])?.value,
        choiceTaxi: this.formValidate.get(['choiceTaxi'])?.value,
        personsNum: this.formValidate.get(['persons'])?.value,
        seigeEnfant: this.formValidate.get(['seigeEnfant'])?.value,
        vol: this.formValidate.get(['vol'])?.value,
        time: this.formValidate.get(['time'])?.value,
        from: this.from,
        to: this.to,
        suitecaseNum: this.formValidate.get(['suitecase'])?.value,
        additionalInfo: this.formValidate.get(['additionalInfo'])?.value,
        estimation: this.estimatedPrice ? Math.round(this.estimatedPrice) : 0,
        payment: this.formValidate.get(['payment'])?.value,
      };
      console.log(newBooking);

      this.validateBooking.createBooking(newBooking).subscribe((data) => {
        window.location.href = data.url;
        this._notify.openSnackbar('Success', SnackBarState.Success, 3000);
      });
    } else {
      this.formValidate.hasError;
      this._notify.openSnackbar('Error', SnackBarState.Error, 3000);
    }
  }

  getDistProces() {
    const p1 = this.formValidate.get(['pickUp'])?.value;
    const p2 = this.formValidate.get(['dropOff'])?.value;
    if (!!p1 && !!p2 && p1 != 'other' && p2 != 'other') {
      this.validateBooking.getPrice(p1, p2).subscribe((price) => {
        // console.log(price.data[0].price);
        this.estimationCost = price.data[0].price;
      });
    } else {
      this.estimationCost = 0;
    }
  }

  getDistance() {
    const p1 = this.from; //(<HTMLInputElement>document.getElementById('from')).value;
    const p2 = this.to; //(<HTMLInputElement>document.getElementById('to')).value;
    if (!!p1 && !!p2) {
      return new google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: [p1],
          destinations: [p2],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (results: any) => {
          // console.log('distance results (mts) -- ', results.rows[0].elements[0])
          this.DistanceText = results.rows[0].elements[0].distance.text;
          this.DistanceValue = results.rows[0].elements[0].distance.value;
          this.durationText = results.rows[0].elements[0].duration.text;
          this.durationValue = results.rows[0].elements[0].duration.value;

          if (this.DistanceValue / 1000 < 20) {
            // console.log('from if' , this.DistanceValue);
            this.estimatedPrice = (this.DistanceValue / 1000) * 2.5;
          } else {
            // console.log('from Else' , this.DistanceValue);
            this.estimatedPrice = (this.DistanceValue / 1000) * 1.5;
          }
        }
      );
    }
  }

  getFrom(place: object) {
    this.from = place['formatted_address'];
    this.getDistance();
  }

  getTo(place: object) {
    this.to = place['formatted_address'];
    this.getDistance();
  }
}

/**
 * Validates a FormGroup containing `country` and `number` fields that
 * are used to generate a {@see PhoneNumber}. Valid numbers are
 * determined by the PhoneNumber.isValid() method.
 */
export const phoneValidator: any = (
  control: FormGroup
): ValidationErrors | null => {
  const country = control.get('country');
  const num = control.get('number');
  if (
    num?.value &&
    country?.value &&
    !new PhoneNumber(num.value, country.value).isValid()
  ) {
    return { invalidPhone: true };
  } else {
    return null;
  }
};

/**
 * {@see ErrorStateMatcher} used to update the error state of the
 * phone number when the country or phone number changes.
 */
export class PhoneErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(control?.value && control.touched && !control?.parent?.valid);
  }
}
