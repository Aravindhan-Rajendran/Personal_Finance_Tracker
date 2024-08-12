import React from 'react';
import { Line, Pie } from '@ant-design/charts'; // Ensure this import is correct
import "../../App.css";

function ChartComponent({ transactions }) {
    // Ensure transactions is an array
    const data = (transactions || []).map((item) => ({
        date: item.date,
        amount: item.amount,
    }));

    // Filter and prepare data for Pie chart
    const spendingData = (transactions || [])
        .filter((transaction) => transaction.type === "expense")
        .map((transaction) => ({
            tag: transaction.tag,
            amount: transaction.amount,
        }));

    const lineConfig = {
        data,
        width: 500,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
        seriesField: 'type', // Adjust if you have a series field
        smooth: true, // Option for smooth lines
        lineStyle: {
            stroke: '#1890ff', // Line color
            lineWidth: 2, // Line width
        },
        xAxis: {
            line: {
                style: {
                    stroke: '#d9d9d9', // Color of x-axis line
                    lineWidth: 1, // Line width
                },
            },
            tickLine: {
                style: {
                    stroke: '#d9d9d9', // Color of tick lines
                    lineWidth: 1, // Line width
                },
            },
            label: {
                style: {
                    fill: '#000', // Color of x-axis labels
                },
            },
        },
        yAxis: {
            line: {
                style: {
                    stroke: '#d9d9d9', // Color of y-axis line
                    lineWidth: 1, // Line width
                },
            },
            tickLine: {
                style: {
                    stroke: '#d9d9d9', // Color of tick lines
                    lineWidth: 1, // Line width
                },
            },
            label: {
                style: {
                    fill: '#000', // Color of y-axis labels
                },
            },
        },
        tooltip: {
            shared: true, // Display tooltip for all series
            showCrosshairs: true, // Display crosshairs
        },
    };

    const pieConfig = {
        data: spendingData,
        angleField: 'amount',
        colorField: 'tag',
        width: 500,
        autoFit: true,
    };

    return (
        <div className='charts-wrapper'>
            <div>
                <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
                <Line {...lineConfig} />
            </div>
            <div>
                <h2>Your Spendings</h2>
                <Pie {...pieConfig} />
            </div>
        </div>
    );
}

export default ChartComponent;