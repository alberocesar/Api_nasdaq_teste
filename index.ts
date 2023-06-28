import { GenericFilterImpl } from "./genericFilterImpl";

const filter = new GenericFilterImpl();

//filter.getPricePerDay('SUGAR_C', '05', '2021');
//filter.getPricePerMonth('SUGAR_C', '2020');
//filter.getPricePerYear('SUGAR_C');
filter.getAveragePricePerYear('SUGAR_C');