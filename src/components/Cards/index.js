import React from 'react';
import './style.css';
import { Card, Row } from 'antd'; // Use 'antd' if Ant Design is intended
import Button from '../Button';

function Cards({
    income,
    expense,
    totalbalance,
    showExpenseModal,
    showIncomeModal}) {
    return (
        <div>
            <Row className="my-row">
                <Card bordered={true} className='my-card'>
                    <h2>Current Balance</h2>
                    <p>₹{totalbalance}</p>
                    <Button text="Reset Balance" blue={true}/>
                </Card>
                <Card bordered={true} className='my-card'>
                    <h2>Total Income</h2>
                    <p>₹{income}</p>
                    <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
                </Card>
                <Card bordered={true} className='my-card'>
                    <h2>Total Expenses</h2>
                    <p>₹{expense}</p>
                    <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>
                </Card>
            </Row>
        </div>
    );
}

export default Cards;