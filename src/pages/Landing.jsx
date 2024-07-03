/** @format */

import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const MainContent = () => {
	return (
		<div className='h-screen flex flex-col justify-center items-center'>
			<h1 className='text-4xl font-bold text-zinc-900 text-center'>
				Welcome to ACE TAXI
			</h1>
			<p className='text-lg text-zinc-700 mt-4 text-center'>
				Dive deep into the world of Taxis
			</p>
			<Link to='/app'>
				<Button variant='contained'>Enter</Button>
			</Link>
		</div>
	);
};

const Landing = () => {
	return (
		<>
			<MainContent />
		</>
	);
};

export default Landing;
