import React, { useState } from 'react';
import { Select, Table, Radio } from 'antd';
import { unparse, parse } from 'papaparse';
import searchImg from "../../assets/Search_Icon.svg.png";
import { toast } from 'react-toastify';
const { Option } = Select;

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [transactionList, setTransactionList] = useState(transactions);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    // Filter transactions based on search and typeFilter
    let filteredTransactions = transactionList
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase())
            &&
            item.type.includes(typeFilter));

    // Sort transactions based on sortKey
    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === 'date') {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === 'amount') {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    function exportCSV() {
        const csv = unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: transactionList
        });
        const blob = new Blob([csv], { type: "text/csv; charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function addTransaction(newTransaction) {
        // Add transaction to state or backend
        setTransactionList(prevList => [...prevList, newTransaction]);
    }

    function fetchTransactions() {
        // Fetch transactions from backend or data source
        // For demonstration, setting the transactions to the same data
        setTransactionList(transactions);
    }

    function importCSV(event) {
        event.preventDefault();
        const file = event.target.files[0];
    
        if (!file) {
            toast.error("No file selected.");
            return;
        }
    
        parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                console.log('CSV Parsing Result:', result);
                if (result.errors.length) {
                    toast.error("Error parsing CSV.");
                    console.error('CSV Parsing Errors:', result.errors);
                    return;
                }
    
                try {
                    const transactionsToAdd = result.data.map((item) => ({
                        type: item.type,
                        date: item.date,
                        amount: parseFloat(item.amount),
                        tag: item.tag,
                        name: item.name,
                    }));
    
                    // Add each transaction to the state and/or database
                    transactionsToAdd.forEach(transaction => addTransaction(transaction, true));
    
                    toast.success("CSV file processed and transactions added successfully.");
                    fetchTransactions(); // Refresh transactions if needed
                } catch (e) {
                    toast.error("Error processing transactions.");
                    console.error('Error Processing Transactions:', e);
                } finally {
                    event.target.value = null; // Clear the input value
                }
            },
            error: (error) => {
                toast.error("Error reading CSV file.");
                console.error('CSV Reading Error:', error);
            }
        });
    }      

    return (
        <div
            style={{
                width: "97%",
                padding: "0rem 2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className='input-flex'>
                    <img src={searchImg} alt="Search Icon" width="16" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search by Name'
                    />
                </div>
                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>
            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>
                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}>
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn" onClick={exportCSV}>
                            Export to CSV
                        </button>
                        <label htmlFor="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input
                            id="file-csv"
                            type="file"
                            accept=".csv"
                            onChange={importCSV}
                            required
                            style={{ display: "none" }}
                        />
                    </div>
                </div>
                <Table dataSource={sortedTransactions} columns={columns} />
            </div>
        </div>
    );
}

export default TransactionTable;
