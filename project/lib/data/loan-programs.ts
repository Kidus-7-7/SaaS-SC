import { LoanProgram } from '../types/partner';

export const loanPrograms: LoanProgram[] = [
  {
    id: 1,
    name: 'First-Time Home Buyer Loan',
    description: 'Special mortgage program for first-time home buyers with competitive rates',
    interestRate: 12.5,
    term: 'Up to 20 years',
    requirements: 'Minimum 20% down payment, proof of income, Ethiopian citizenship',
    partnerId: 1
  },
  {
    id: 2,
    name: 'Construction Loan',
    description: 'Financing solution for property construction projects',
    interestRate: 13.5,
    term: 'Up to 15 years',
    requirements: 'Land ownership document, approved building permit, 30% equity',
    partnerId: 2
  },
  {
    id: 3,
    name: 'Investment Property Loan',
    description: 'Loan program for real estate investors',
    interestRate: 14,
    term: 'Up to 10 years',
    requirements: 'Business plan, proof of rental income, 40% down payment',
    partnerId: 3
  }
];