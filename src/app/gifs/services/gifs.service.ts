import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {

  private apiKey     : string = '1P11qagpSI055Ch7leFMv7SwngAFQLxJ';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];

  // TODO: Cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  //Rompemos la referencia con el operador spread
  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    //Forma Larga
    if ( localStorage.getItem( 'historial' ) ) {
      this._historial = JSON.parse( localStorage.getItem( 'historial' )! );
    }

    //Forma corta
    this.resultados = JSON.parse(localStorage.getItem( 'historialImagenes' )! ) || [];

  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    //Si no existe en nuestro historial insertelo
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      //Esto nos va a cortar nuestro arreglo principal
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
          .set('api_key', this.apiKey)    
          .set('limit', '10')    
          .set('q', query);   

    //Le estamos diciendo a TypeScript que la respuesta luce como esa interface SearchGifsResponse
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params } )
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('historialImagenes', JSON.stringify( this.resultados ));
    });

      
    
  }
}
