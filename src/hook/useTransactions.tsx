import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

// OPÇÃO 1 - fazem a mesma coisa
// interface TransactionInput {
//   title: string;
//   amount: number;
//   type: string;
//   category: string
// }

// OPÇÃO 2
// Pick = Pega somente os dados que tu vai usar de outra interface
// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category'>

// OPÇÃO 3
// Omit = Oculte/Omite os dados que tu não vai usar de outra interface
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

// ReactNode é usado sempre o {children} e para elementos/componentes do React.
interface TransactionProviderProps {
  children: ReactNode
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>
}

// Cria o contexto
const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

// Criou e separou o Provider do contexto no componente abaixo para pode exportar e usar ele lá no App.tsx já passando os dados que "por motivo de intuitividade/lógica" pertencem ao Transactions
export function TransactionsProvider({children}:TransactionProviderProps){
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('transactions')
    .then(response => setTransactions(response.data.transactions))
  },[]);

  async function createTransaction(transactionInput: TransactionInput){
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date()
    });

    const { transaction } = response.data;

    setTransactions([
      ...transactions,
      transaction,
    ])
  }

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  )

}

export function useTransactions(){
  const context = useContext(TransactionsContext)
  return context;
}