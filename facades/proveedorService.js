const Proveedor = require('../models/Proveedor');
const ProveedorBuilder = require('../builders/proveedoresBuilder');

class ProveedorService {
    async obtenerProveedores() {
        return await Proveedor.findAll();
    }

    async crearProveedor(data) {
        const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = data;

        const proveedorBuilder = new ProveedorBuilder()
            .setNombre(nombre)
            .setDireccion(direccion)
            .setTelefono(telefono)
            .setEmail(email)
            .setComentario(comentario)
            .setTiempoEntregaEstimado(tiempo_entrega_estimado);

        return await Proveedor.create(proveedorBuilder.build());
    }

    async actualizarProveedor(proveedor_id, data) {
        const { nombre, direccion, telefono, email, comentario, tiempo_entrega_estimado } = data;

        const proveedor = await Proveedor.findByPk(proveedor_id);
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        const proveedorBuilder = new ProveedorBuilder()
            .setNombre(nombre)
            .setDireccion(direccion)
            .setTelefono(telefono)
            .setEmail(email)
            .setComentario(comentario)
            .setTiempoEntregaEstimado(tiempo_entrega_estimado);

        await proveedor.update(proveedorBuilder.build());
        return proveedor;
    }

    async eliminarProveedor(proveedor_id) {
        const proveedor = await Proveedor.findByPk(proveedor_id);
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }

        await proveedor.destroy();
        return proveedor;
    }
}

module.exports = new ProveedorService();
