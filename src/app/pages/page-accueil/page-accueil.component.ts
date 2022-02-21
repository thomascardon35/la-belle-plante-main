import { Component, OnInit } from '@angular/core';
import { PlantouneService } from 'src/app/services/plantoune.service';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import jwt_token from 'jwt-decode';
import { forkJoin } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-page-accueil',
  templateUrl: './page-accueil.component.html',
  styleUrls: ['./page-accueil.component.scss'],
})
export class PageAccueilComponent implements OnInit {
  public listData: any[];
  public listDataAll: any[];
  public listCategoriesFilter: string[];
  public categoriesClicked: string[];
  public listSearchInput: any[];
  public listDataByCat: string[];
  public listCateg: string[];
  public searchInput: string;
  public prices: number[];
  public counterOrdre ?: boolean;
  public counterAvis ?: boolean;
  public counterPrix ?: boolean;
  public rating: number;

  constructor(private plantouneService: PlantouneService, private tokenService: TokenService) {
    this.listData = [];
    this.listDataAll = [];
    this.listCategoriesFilter = [];
    this.categoriesClicked = [];
    this.listSearchInput = [];
    this.listDataByCat = [];
    this.listCateg = [];
    this.searchInput = '';
    this.prices = [];
    this.counterOrdre = undefined;
    this.counterAvis = undefined;
    this.counterPrix = undefined;
    this.rating = 0;
  }
  /**
   * equivalent de la ligne du dessus
   *
   * plantouneService;
   *
   * constructor(plantouneService: PlantouneService) {
   *   this.plantouneService = plantouneService;
   * }
   */

  ngOnInit(): void {
    const userId = this.tokenService.getCurrentUserId();
    
    if(userId) {

      const listObservable = [this.plantouneService.getData(), this.plantouneService.getPlantFav(userId)]
      forkJoin(listObservable).subscribe((listResp: any[]) => {
        console.log("Reponse forkjoin list plant : ", listResp[0])
        console.log("Reponse forkjoin list plant fav : ", listResp[1]);
      })

      forkJoin({
        listPlant: this.plantouneService.getData(),
        listPlantFav: this.plantouneService.getPlantFav(userId)
      }).subscribe(({listPlant, listPlantFav}) => {
          console.log("plant liké : ", listPlantFav);

              // j'ai accès à la réponse qui contient ma liste de plante 
              // j'ai accès à la réponse qui contient mes plant favorites/likées
              this.listCategoriesFilter = this.buildListCategory(listPlant);
              
              // toutes les plantes mises en favorites par l'utilsateur connecté => leur ajouter une propriété => plantlikée
              this.listData = listPlant;

              // extraction des plantId 
              const listPlantIdLike = listPlantFav.map((x: any) => x.plantId);  

              // ajout de la propriété plantLike à true sur les plantes likées si elles sont dans le tableau de plante likées 
              this.listData.forEach((plant: any) =>  {
                if(listPlantIdLike.includes(plant.product_id))
                  plant.plantLike = true;
              });

              this.listData.length = 9;
      })


      // faire un call api pour récupérer nos plantes 
      // this.plantouneService.getData().subscribe(
      //   (listPlant: any[]) => {
      //     this.plantouneService.getPlantFav(userId).subscribe(
      //       (data: any) => {
      //         console.log("plant liké : ", data);

      //         // j'ai accès à la réponse qui contient ma liste de plante 
      //         // j'ai accès à la réponse qui contient mes plant favorites/likées
      //         this.listCategoriesFilter = this.buildListCategory(listPlant);
              
      //         // toutes les plantes mises en favorites par l'utilsateur connecté => leur ajouter une propriété => plantlikée
      //         this.listData = listPlant;

      //         // extraction des plantId 
      //         const listPlantIdLike = data.map((x: any) => x.plantId);  

      //         // ajout de la propriété plantLike à true sur les plantes likées si elles sont dans le tableau de plante likées 
      //         this.listData.forEach((plant: any) =>  {
      //           if(listPlantIdLike.includes(plant.product_id))
      //             plant.plantLike = true;
      //         });

      //         this.listData.length = 9;
      //       }
      //     )
          
      //   }
      // )
      
      // toutes les plantes mises en favorites par l'utilsateur connecté => leur ajouter une propriété => plantlikée
    } else {

      this.plantouneService.getData().subscribe(
        (listPlant: any[]) => {

          this.listCategoriesFilter = this.buildListCategory(listPlant);

          this.listData = [...listPlant];
          this.listDataAll = [...listPlant];
          this.listData.length = 150;
          this.listSearchInput = [...listPlant];
        }
      );
    }
  }

  private buildListCategory(listPlant: any[]): string[] {
    const listAllCategories = listPlant.map(product => product.product_breadcrumb_label);
    const listUniqCategories = _.uniq(listAllCategories)
    return listUniqCategories;
  }

  onEventLike() {
    this.plantouneService.plantLiked$.next('');
  }

  onCategoriesClicked(listCategory: string[], listData: any[]): any[] {
    if (listCategory.length === 0) {
      return listData;
    } else {
      return listData.filter((product) =>
        listCategory.includes(product.product_breadcrumb_label)
      );
    }
  }

  onSearchFilter(searchInput: string, listData: any[]): any[] {
    //const search = inputEvent.target.value;
    if (searchInput) {
      return listData.filter((element) => {
        return element.product_name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
    } else {
      return listData;
    }
  }

  filterPrice(prices: number[], listData: any[]) {
    console.log(prices);
    
    if (prices.length === 0) {
      return listData;
    } else {
      return listData.filter(
        (product) =>
          prices[0] < parseFloat(product.product_unitprice_ati) &&
          prices[1] > parseFloat(product.product_unitprice_ati)
      );
    }
  }

  filterRating(rating: number, listData: any[]) {
    if (rating === 0) {
      return listData;
    } else {
      return listData.filter((product) => rating <= product.product_rating);
    }
  }

  //searchAllJb($event, null, null, null);
  searchAllJb(
    newListCateg: string[] | null,
    newFilterPrice: any | null,
    newFilterRating: number | null,
    newSearchInput: any | null
  ) {
    //si != null => this.listCateg = newListCateg;
    if (newListCateg != null) {
      this.listCateg = newListCateg;
    } else if (newSearchInput != null) {
      this.searchInput = newSearchInput.target.value;
    } else if (newFilterPrice != null) {
      this.prices = newFilterPrice;
    } else if (newFilterRating != null) {
      this.rating = newFilterRating;
    }

    const dataFilterCategory = this.onCategoriesClicked(
      this.listCateg,
      this.listDataAll
    );
    //console.log(dataFilterCategory);

    const dataFilterSearchInput = this.onSearchFilter(
      this.searchInput,
      dataFilterCategory
    );

    const dataFilterPrice = this.filterPrice(
      this.prices,
      dataFilterSearchInput
    );

    const dataRating = this.filterRating(this.rating, dataFilterPrice);

    this.listData = dataRating;

    //this.sortAlpha();

    // onfilterCategorie() => plant[] =>result

    // onfilterSearch(result) => plant()
  }

  sortAlpha() {
    this.counterAvis = undefined;
    this.counterPrix = undefined;
    if (this.counterOrdre === false) {
      this.listData.sort((a, b) =>
        b.product_name.localeCompare(a.product_name)
      );
      this.counterOrdre = true;
    } else {
      this.listData.sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
      this.counterOrdre = false;
    }
  }

  sortAvis() {
    this.counterOrdre = undefined;
    this.counterPrix = undefined;
    if (this.counterAvis === false) {
      this.listData.sort((a, b) => 
        b.product_rating - a.product_rating
      );
      this.counterAvis = true;
    } else {
      this.listData.sort((a, b) =>
      a.product_rating - b.product_rating
      );
      this.counterAvis = false;
    }
  }

  sortPrix() {
    this.counterOrdre = undefined;
    this.counterAvis = undefined;
    if (this.counterPrix === false) {
      this.listData.sort((a, b) => 
        b.product_unitprice_ati - a.product_unitprice_ati
      );
      this.counterPrix = true;
    } else {
      this.listData.sort((a, b) =>
      a.product_unitprice_ati - b.product_unitprice_ati
      );
      this.counterPrix = false;
    }
  }
}