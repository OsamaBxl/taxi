import { Component, ElementRef, Input, OnInit , AfterViewInit} from '@angular/core';
import { ValidateBookingService } from 'src/app/services/validate-booking.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit , AfterViewInit{
  @Input() checkoutID:string; 
  wpwlOptions = {style:"card"}
  constructor(private _db:ValidateBookingService,private elementRef:ElementRef) { }

  ngOnInit(): void {
    // this._db.paymentForm(this.checkoutID).subscribe((data)=>{
    //   console.log(data);
    // })
  }


  ngAfterViewInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${this.checkoutID}`;
    this.elementRef.nativeElement.appendChild(s);
  }

}

var wpwlOptions = { style: "card" }

