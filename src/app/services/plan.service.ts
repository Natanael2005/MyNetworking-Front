import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

// Ajusta la interfaz para reflejar la respuesta real del backend
export interface Plan {
  id: string;
  nickname: string;
  price: string; // <--- tu backend devuelve price como string ("1500.00")
  currency: string;
  interval: string;
  product: string;
  productId: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    // Si tu ruta es http://localhost:4000/stripe/plans, usa así:
    return this.http.get<Plan[]>(`${environment.apiUrl}stripe/plans`);
    // Si cambias a /api/stripe/plans, agrega el prefijo "api/" en apiUrl
  }
}
