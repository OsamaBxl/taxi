import { Component, OnInit, Output } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateBookingService } from 'src/app/services/validate-booking.service';
import { BOOkingData } from 'src/app/interfaces/booking-data';
import { NotificationService } from 'src/app/services/notification.service';
import { SnackBarState } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Output() checkoutID: string;

  choiceTaxi = 'standard';
  seigeEnfant = 'no';
  phoneCode = '+32';
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
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(11),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phoneCode: new FormControl(null, [Validators.required]),
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
  constructor(private validateBooking: ValidateBookingService,
              private _notify:NotificationService) {}

  ngOnInit(): void {}

  onFormSubmit() {
    if (this.formValidate.valid) {
      let phoneNumber =
        this.formValidate.value.phoneCode + this.formValidate.value.phoneNumber;

      if (phoneNumber[3] == '0') {
        phoneNumber = phoneNumber.replace('0', '');
      }

      const newBooking: BOOkingData = {
        fullName: this.formValidate.get(['fullName'])?.value,
        phoneCode: this.formValidate.get(['phoneCode'])?.value,
        phoneNumber: this.formValidate.get(['phoneNumber'])?.value,
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
      this.validateBooking.createBooking(newBooking).subscribe((data) => {
        window.location.href = data.url;
        this._notify.openSnackbar('Success' , SnackBarState.Success , 3000)
      });
    } else {
      this.formValidate.hasError;
      this._notify.openSnackbar('Error' , SnackBarState.Error , 3000)
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
