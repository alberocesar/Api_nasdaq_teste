export interface GenericFilter<T> {

    getPricePerDay(product: string, month: string, year: string): Promise<void>;
    getPricePerMonth(product: string, year: string): Promise<void>;
    getPricePerYear(product: string): Promise<void>;
    getAveragePricePerYear(product: string): Promise<void>;
}