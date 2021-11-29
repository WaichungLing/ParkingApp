import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../Pages/App';
import React from 'react';
import ReactDOM from 'react-dom';

beforeEach(() => {
    render(<BrowserRouter>
	     <App />
	   </BrowserRouter>)
});

it('renders without crashing', () => {
    
});

it('renders main heading', () => {
    expect(screen.getByText('PARKING APP')).toBeInTheDocument();
});

it('renders buttons', () => {
    expect(screen.getByText("SIGNUP")).toBeInTheDocument();
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
});

it('renders fields', () => {
    const username = screen.getByLabelText("UserName");
    const phonenumber = screen.getByLabelText("Phone# Start With 1");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    expect(username).toBeInTheDocument();
    expect(phonenumber).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
});

it('renders login page', () => {
    const login = screen.getAllByRole('button');
    fireEvent.click(login[1]);
    const username = screen.queryByText('UserName');
    const email = screen.queryByText('Email');
    expect(username).toBeNull();
    expect(email).toBeNull();
});
