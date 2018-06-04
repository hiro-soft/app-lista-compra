export interface ListaInterface{
    id?: string;
    nombre?: string;
    productosPendientes?: Array<ListaProductoInterface>;
    productosComprados?: Array<ListaProductoInterface>;
}

export interface ListaProductoInterface{
    id?: string;
    nombre?: string;
    unidades?: number;
    estado?: string;
}
