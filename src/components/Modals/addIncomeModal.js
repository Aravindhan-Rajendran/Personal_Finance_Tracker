import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";

function AddIncomeModal({
    isIncomeModalVisible,
    handleIncomeCancel,
    onFinish,
}) {
    const [form] = Form.useForm();

    return (
        <Modal
            style={{ fontWeight: 600 }}
            title="Add Income"
            visible={isIncomeModalVisible}
            onCancel={handleIncomeCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => {
                    onFinish(values, "income");
                    form.resetFields();
                }}
            >
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input the name of the transaction!",
                        },
                    ]}
                >
                    <Input type="text" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Amount"
                    name="amount"
                    rules={[
                        {
                            required: true,
                            message: "Please input the income amount!",
                        },
                        {
                            validator: (_, value) => {
                                if (!value || value <= 0) {
                                    return Promise.reject(new Error('Amount must be a positive number!'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input type="number" className="custom-input" />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Date"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: "Please select the income date!",
                        },
                    ]}
                >
                    <DatePicker
                        className="custom-input"
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: 600 }}
                    label="Tag"
                    name="tag"
                    rules={[
                        {
                            required: true,
                            message: "Please select a tag!",
                        },
                    ]}
                >
                    <Select className="select-input-2" placeholder="Select a tag">
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="education">Education</Select.Option>
                        <Select.Option value="office">Office</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button
                        className="btn btn-blue"
                        type="primary"
                        htmlType="submit"
                    >
                        Add Income
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddIncomeModal;