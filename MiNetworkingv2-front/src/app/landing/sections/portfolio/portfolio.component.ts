import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit {
  images: any[] = [];
  
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnInit() {
    this.images = [
      {
        src: 'assets/images/prueba.jpg',
        alt: 'Descripción imagen 1'
      },
      {
        src: 'assets/images/prueba2.jpg',
        alt: 'Descripción imagen 2'
      },
      {
        src: 'assets/images/prueba3.jpg',
        alt: 'Descripción imagen 3'
      },
      {
        src: 'assets/images/prueba2.jpg',
        alt: 'Descripción imagen 2'
      },
    ];
  }
}