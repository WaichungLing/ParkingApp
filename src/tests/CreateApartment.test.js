import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import CreateApartment from '../Pages/CreateApartment';
import React from 'react';
import ReactDOM from 'react-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
	<BrowserRouter>
	    <Routes>
	      <Route path="create" element={<CreateApartment/>}/>
	    </Routes>
	</BrowserRouter>, div
    );
});

