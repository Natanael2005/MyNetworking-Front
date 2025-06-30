import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { title } from 'process';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [AccordionModule, CommonModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent {
  tabs = [
        { title: '¿Qué es una hoja Horli y para qué sirve?', content: 'La hoja HORLI es una presentación breve, profesional y visualmente atractiva que resume tus habilidades, intereses, redes y logros. Está diseñada para destacar rápidamente en eventos, entrevistas o espacios de networking, facilitando conexiones efectivas.' },
        { title: '¿Cómo genero mi hoja de presentación personalizada?', content: 'Solo necesitas registrarte, completar un formulario dinámico con tus datos (como perfil profesional, intereses y redes). Luego podrás previsualizar, descargar o compartir tu hoja en formato PNG o PDF' },
        { title: '¿Cómo funciona la suscripción y qué métodos de pago aceptan?', content: 'Ofrecemos suscripciones mensuales y anuales a través de Stripe. Aceptamos tarjetas de débito, crédito y otros métodos compatibles. Puedes cancelar en cualquier momento desde tu perfil sin penalizaciones.' },
        {title: '¿Necesito experiencia en diseño o tecnología para usar la plataforma?', content: 'No. Mi Networking fue creada para ser intuitiva y accesible. No necesitas conocimientos técnicos. Solo completa los formularios y el sistema se encarga del diseño automáticamente.'},
        {title:'¿Qué pasa si pierdo el enlace de mi hoja? ¿Puedo recuperarlo?', content: 'Sí. Puedes acceder a tu historial de hojas desde tu cuenta y volver a copiar el enlace o descargarla nuevamente. También puedes regenerar el QR en cualquier momento.'}
    ];
}
  