import React from 'react';
import '../css/Inicio.css';

const Inicio = () => {
  return (
    <section className="about-sec parallax-section">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h2>Nosotros</h2>
          </div>
          <div className="col-md-4">
            <h3>¿Quiénes somos?</h3>
            <p>“Somos una empresa que busca satisfacer la necesidades de nuestros clientes, ofreciendo los mejores productos desde el año 2007, con más de 15 años brindando productos y servicios de calidad y de garantía comprobada”</p>
          </div>
          <div className="col-md-4">
            <h3>Misión</h3>
            <p>Hacer que el orden y la comodidad sea parte de cualquier espacio propio de nuestros clientes.</p>
          </div>
          <div className="col-md-4">
            <h3>Visión</h3>
            <p>Convertirnos en un mediano plazo en la primera empresa Boliviana en exportar mobiliario que combina derivados de madera, rejillas y acero, manteniendo estándares de calidad y diseño moderno.</p>
          </div>
          <div className="col-md-4">
            <h3>Historia</h3>
            <p>2007 : Nace Practicloset legalmente:<br />Nacemos como fabricantes de Rejillas De Acero Plastificadas. Siendo la única empresa a nivel nacional en el rubro.</p>
            <p>2011 : Ampliamos la unidad de negocio:<br />Empezamos con el diseño y fabricación de mobiliarios utilizando derivados de madera.</p>
            <p>2015: Combinamos ambos negocios:<br />La tendencia del mercado, generó la idea de la combinación de ambos negocios. Empezamos con el diseño y fabricación de mobiliarios modernos combinando acero y derivados de madera.</p>
            <p>Hoy en día, continuamos siendo la única empresa a nivel nacional, fabricante de rejillas de acero plastificadas. Habiendo ampliado nuestro mercado a diferentes ciudades de Bolivia. Así mismo nuestros mobiliarios son de gran demanda a nivel nacional.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inicio;
