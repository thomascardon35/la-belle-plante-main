import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantouneService } from 'src/app/services/plantoune.service';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.scss']
})
export class PageDetailsComponent implements OnInit {
  detailPlant :any;

  constructor(
    private plantouneService: PlantouneService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.plantouneService.getProductById(productId).subscribe((description : any[])=>{
      this.detailPlant = description[0];
    });
  }

}
