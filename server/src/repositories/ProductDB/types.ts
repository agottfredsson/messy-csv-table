export interface IProductDB {
  getProductsBySku(sku: string): Promise<any>;
}
