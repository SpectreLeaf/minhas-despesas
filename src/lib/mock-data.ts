// TODO non-mock local data

export interface CardData {
  id: number;
  description: string;
  date: Date;
  price: number;
  paid: boolean;
  isRepeating: boolean;
  isInInstallments: boolean;
  installmentCount?: number;
  currentInstallment?: number;
}

export const mockData: CardData[] = [
  {
    id: 0,
    date: new Date(),
    description: "Despesa 1",
    price: 900.0,
    paid: true,
    isRepeating: true,
    isInInstallments: true,
    installmentCount: 12,
    currentInstallment: 3,
  },
  {
    id: 1,
    date: new Date(),
    description: "Despesa 2",
    price: 100.0,
    paid: false,
    isRepeating: false,
    isInInstallments: false,
  },
];
