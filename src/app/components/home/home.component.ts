import { Component, OnInit, Output } from '@angular/core';
import { faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateBookingService } from 'src/app/services/validate-booking.service';
import { BOOkingData } from 'src/app/interfaces/booking-data';

declare function calculateDirection();
// declare function calcRoute();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Output() checkoutID: string;

  choiceTaxi = 'standard';
  phoneCode = '+32';
  payment = 'cash';
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
      Validators.minLength(9),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    pickUp: new FormControl(null, [Validators.required]),
    dropOff: new FormControl(null, [Validators.required]),
    from: new FormControl(null, [Validators.required]),
    phoneCode: new FormControl(null, [Validators.required]),
    otherAddressPick: new FormControl(null),
    otherAddressDrop: new FormControl(null),
    to: new FormControl(null, [Validators.required]),
    suitecase: new FormControl(null, [Validators.required]),
    persons: new FormControl(null, [Validators.required]),
    choiceTaxi: new FormControl(null, [Validators.required]),
    time: new FormControl(null, [Validators.required]),
    payment: new FormControl(null, [Validators.required]),
    additionalInfo: new FormControl(null),
  });

  DistanceText: string;
  DistanceValue: number;
  durationText: string;
  durationValue: number;
  estimatedPrice: number;

  constructor(private validateBooking: ValidateBookingService) {}

  ngOnInit(): void {
    // this.onFormSubmit(this.formValidate);
    // this.onValidateFromBackEnd();

    //Call the function calculateDirection from assets/js/mapDirection.js
    calculateDirection();
    // calcRoute();

    this.validateBooking.getplaces().subscribe((places) => {
      // console.log(places);
      this.myPlaces = places.data;
    });
  }

  // onValidateFromBackEnd() {
  //   this.validateBooking
  //     .validateBooking(this.formValidate.value)
  //     .subscribe((data) => {
  //       console.log(data);
  //     });
  // }

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
        time: this.formValidate.get(['time'])?.value,
        pickUp: this.formValidate.get(['pickUp'])?.value,
        dropOff: this.formValidate.get(['dropOff'])?.value,
        from: this.formValidate.get(['from'])?.value,
        to: this.formValidate.get(['to'])?.value,
        suitecaseNum: this.formValidate.get(['suitecase'])?.value,
        additionalInfo: this.formValidate.get(['additionalInfo'])?.value,
        estimation: this.estimationCost,
        otherAddressDrop: this.formValidate.get(['otherAddressDrop'])?.value,
        otherAddressPick: this.formValidate.get(['otherAddressPick'])?.value,
        payment: this.formValidate.get(['payment'])?.value,
      };
      console.log(newBooking);
      this.validateBooking.createBooking(newBooking).subscribe((data) => {
        console.log(data);
        this.formValidate.reset();
      });
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
    const p1 = (<HTMLInputElement>document.getElementById('from')).value;
    const p2 = (<HTMLInputElement>document.getElementById('to')).value;
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
            this.estimatedPrice = (this.durationValue / 1000) * 2.5;
          } else {
            this.estimatedPrice = (this.durationValue / 1000) * 1.5;
          }
        }
      );
    }
  }
}
