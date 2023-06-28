import { GenericFilter } from "./genericFilter";
import axios from "axios";

export class GenericFilterImpl<T> implements GenericFilter<void> {

    async getPricePerDay(product: string, month: string, year: string): Promise<void> {
        const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/CEPEA/${product}.json/?&api_key=AJqswHQAeMfyPJn7N2Dq`);
        const allInformation = response.data.dataset.data;

        //Laço para obter apenas a data e o preço de cada array.
        const dateAndPrice: Array<[string, string]> = [];
        allInformation.forEach((registro: [string, string]) => {
            const date = registro[0];
            const price = registro[1];
            dateAndPrice.push([date, price]);
        });

        //Laço para obter o array[Data, preço] apenas dos dias referentes ao mês e ano escolhidos.
        const dateAndPriceFiltrados: Array<[string, string]> = [];
        dateAndPrice.forEach((registro: [string, string]) => {
            const date = registro[0];
            if (date.startsWith(`${year}-${month}`)) {
                dateAndPriceFiltrados.push(registro);
            }
        });
        console.log(dateAndPriceFiltrados);
    }

    async getPricePerMonth(product: string, year: string): Promise<void> {
        const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/CEPEA/${product}.json/?&api_key=AJqswHQAeMfyPJn7N2Dq`);
        const allInformation = response.data.dataset.data;

        //Laço para obter apenas a data e o preço de cada array.
        const dateAndPrice: Array<[string, string]> = [];
        allInformation.forEach((registro: [string, string]) => {
            const date = registro[0];
            const price = registro[1];
            dateAndPrice.push([date, price]);
        });

        //Laço para obter um array com as datas e preços referentes ao ano escolhido.
        const dateAndPriceFiltrados: Array<[string, string]> = [];
        dateAndPrice.forEach((registro: [string, string]) => {
            const date = registro[0];
            if (date.startsWith(`${year}`)) {
                dateAndPriceFiltrados.push(registro);
            }
        });

        //Laço para obter um array com a data e preço do fechamento (último registro) de cada mês.
        const closingPrice: Record<string, [string, string]> = {};
        dateAndPriceFiltrados.forEach((registro: [string, string]) => {
            const date = registro[0];
            const price = registro[1];

            const month = date.substring(5, 7);
            const day = date.substring(8, 10);

            if (!closingPrice[month] || day > closingPrice[month][0].substring(8, 10)) {
                closingPrice[month] = [date, price];
            }
        });
        console.log(closingPrice);
    }

    async getPricePerYear(product: string): Promise<void> {
        const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/CEPEA/${product}.json/?&api_key=AJqswHQAeMfyPJn7N2Dq`);
        const allInformation = response.data.dataset.data;

        const dateAndPrice: Array<[string, string]> = [];
        allInformation.forEach((registro: [string, string]) => {
            const date = registro[0];
            const price = registro[1];
            dateAndPrice.push([date, price]);
        });

        const closingPrice: Record<string, [string, string]> = {};
        dateAndPrice.forEach((registro) => {
            const date = registro[0];
            const price = registro[1];

            const day = date.substring(8, 10);
            const month = date.substring(5, 7);
            const year = date.substring(0, 4);

            if (!closingPrice[year] || month > closingPrice[year][0].substring(5, 7)) {
                closingPrice[year] = [date, price];
            }
        });
        console.log(closingPrice);
    }

    async getAveragePricePerYear(product: string): Promise<void> {
        const response = await axios.get(`https://data.nasdaq.com/api/v3/datasets/CEPEA/${product}.json/?&api_key=AJqswHQAeMfyPJn7N2Dq`);
        const allInformation: [string, string][] = response.data.dataset.data;
      
        const closingPrice: Record<string, [string, string][]> = {};
      
        allInformation.forEach((registro: [string, string]) => {
          const date = registro[0];
          const price = registro[1];
          const year = date.substring(0, 4);
          const month = date.substring(5, 7);
          const day = date.substring(8, 10);
      
          if (!closingPrice[year]) {
            closingPrice[year] = [];
          }
      
          // Verifica se já existe um registro para o mês atual
          const existingRecord = closingPrice[year].find((record: [string, string]) => record[0].substring(5, 7) === month);
      
          if (!existingRecord || (day > existingRecord[0].substring(8, 10))) {
            closingPrice[year].push([date, price]);
          }
        });
      
        // Cálculo da média dos meses
        const averagePricePerMonth: Record<string, Record<string, number>> = {};
        Object.keys(closingPrice).forEach(year => {
          averagePricePerMonth[year] = {};
      
          closingPrice[year].forEach((record: [string, string]) => {
            const month = record[0].substring(5, 7);
            const price = record[1];
      
            if (!averagePricePerMonth[year][month]) {
              averagePricePerMonth[year][month] = 0;
            }
      
            averagePricePerMonth[year][month] += Number(price);
          });
      
          Object.keys(averagePricePerMonth[year]).forEach(month => {
            averagePricePerMonth[year][month] /= closingPrice[year].length;
          });
        });
      
        // Cálculo da média de todos os anos
        const averagePricePerYear: Record<string, number> = {};
        Object.keys(closingPrice).forEach(year => {
          const yearPrices = closingPrice[year].map((record: [string, string]) => Number(record[1]));
          const yearAverage = yearPrices.reduce((sum, price) => sum + price, 0) / yearPrices.length;
          averagePricePerYear[year] = yearAverage;
        });
      
        console.log('Média detalhada dos meses:');
        console.log(averagePricePerMonth);
      
        console.log('Média de todos os anos:');
        console.log(averagePricePerYear);
}

}