export interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  contact: string;
  website: string;
}

export interface LoanProgram {
  id: number;
  name: string;
  description: string;
  interestRate: number;
  term: string;
  requirements: string;
  partnerId: number;
}