import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {} from 'googlemaps';

@Component({
  selector: 'app-google-places',
  template: `
    <input
      class="input"
      type="text"
      [(ngModel)]="autocompleteInput" [ngModelOptions]="{standalone: true}"
      #addresstext
      style="padding: 8px 20px; border: 1px solid #ccc; width: 100%; min-width:200px"
    />
  `,
  styleUrls: ['./google-places.component.css'],
})
export class GooglePlacesComponent implements OnInit {
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        // componentRestrictions: { country: 'US' },
        // types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
      }
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }
}
