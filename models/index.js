const DetallePedido = require('./DetallePedido');
const Modelo = require('./Modelo');
const Pedido = require('./Pedido');
const DetalleOrden = require('./DetalleOrden');
const Articulo = require('./articulo');
const Proveedor = require('./Proveedor');
const Stock = require('./Stock');
const Trabajador = require('./Trabajador');
const Cliente = require('./Cliente');
const TransaccionInventario = require('./TransaccionInventario');
const Categoria = require('./Categoria');
const OrdenCompra = require('./OrdenCompra');

// Definir asociaciones
Pedido.hasMany(DetallePedido, { foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Modelo.hasMany(DetallePedido, { foreignKey: 'modelo_id' });
DetallePedido.belongsTo(Modelo, { foreignKey: 'modelo_id' });

OrdenCompra.hasMany(DetalleOrden, { foreignKey: 'orden_id' });
DetalleOrden.belongsTo(OrdenCompra, { foreignKey: 'orden_id' });

Articulo.hasMany(DetalleOrden, { foreignKey: 'articulo_id' });
DetalleOrden.belongsTo(Articulo, { foreignKey: 'articulo_id' });

Proveedor.hasMany(Articulo, { foreignKey: 'proveedor_id' });
Articulo.belongsTo(Proveedor, { foreignKey: 'proveedor_id' });

Articulo.hasMany(Stock, { foreignKey: 'producto_id' });
Stock.belongsTo(Articulo, { foreignKey: 'producto_id' });

module.exports = {
  DetallePedido,
  Modelo,
  Pedido,
  DetalleOrden,
  Articulo,
  Proveedor,
  Stock,
  Trabajador,
  Cliente,
  TransaccionInventario,
  Categoria,
};
