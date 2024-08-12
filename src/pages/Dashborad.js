import React, { useEffect, useState } from 'react';
import Header from '../components/Header/index.js';
import Cards from '../components/Cards/index.js';
import AddExpenseModal from '../components/Modals/addExpenseModal.js';
import AddIncomeModal from '../components/Modals/addIncomeModal.js';
import { auth, db } from '../firebase.js';
import { addDoc, collection, query, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from 'moment';
import TransactionTable from '../components/TransactionsTable/index.js';
import ChartComponent from '../components/Charts/index.js';
import NoTransactions from '../components/NoTransactions.js';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transactions, many = false) {
    try {
        if (user) {
            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transaction`), // Ensure path is correct
                transactions
            );
            console.log("Document written with ID: ", docRef.id);

            if (!many) toast.success("Transaction Added!");

            // Fetch transactions again to ensure UI is updated
            await fetchTransactions();
        }
    } catch (e) {
        console.error("Error adding document: ", e);
        if (!many) toast.error("Couldn't add transaction");
    }
}

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
        try {
            const q = query(collection(db, `users/${user.uid}/transaction`)); // Ensure path is correct
            const querySnapshot = await getDocs(q);
            let transactionsArray = [];
            querySnapshot.forEach((doc) => {
                transactionsArray.push(doc.data());
            });
            setTransactions(transactionsArray); // Update state with new transactions
            console.log("Transaction Array", transactionsArray);
            toast.success("Transactions Fetched!");
        } catch (error) {
            console.error("Error fetching transactions: ", error);
            toast.error("Couldn't fetch transactions");
        }
    }
    setLoading(false);
}
let sortedTransactions = transactions.slice().sort((a, b) => {
  return new Date(a.date) - new Date(b.date);
});

return (
  <div>
    <Header />
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        <Cards
          income={income}
          expense={expense}
          totalbalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
        {transactions && transactions.length != 0 ? (
          <ChartComponent transactions={sortedTransactions} />
        ) : (
          <NoTransactions />
        )}
        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={(values) => onFinish(values, 'expense')}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={(values) => onFinish(values, 'income')}
        />
        <TransactionTable
          transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
        />
      </>
    )}
  </div>
);
};

export default Dashboard;