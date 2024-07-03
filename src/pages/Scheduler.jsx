/** @format */

import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
	ViewState,
	EditingState,
	IntegratedEditing,
} from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	DayView,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';

import { appointments } from './demo-data/appointments';

const Demo = () => {
	const [data, setData] = useState(appointments);
	const [currentDate, setCurrentDate] = useState('2024-07-03');
	console.log(data);

	const commitChanges = ({ added, changed, deleted }) => {
		setData((prevData) => {
			let updatedData = prevData;
			if (added) {
				const startingAddedId =
					updatedData.length > 0
						? updatedData[updatedData.length - 1].id + 1
						: 0;
				updatedData = [...updatedData, { id: startingAddedId, ...added }];
			}
			if (changed) {
				updatedData = updatedData.map((appointment) =>
					changed[appointment.id]
						? { ...appointment, ...changed[appointment.id] }
						: appointment
				);
			}
			if (deleted !== undefined) {
				updatedData = updatedData.filter(
					(appointment) => appointment.id !== deleted
				);
			}
			return updatedData;
		});
	};

	useEffect(() => {
		function filterObj(obj) {
			return {
				title: obj.passengerName.trim() || 'No title provided',
				startDate: new Date(obj.pickupDateTime),
				endDate: new Date(obj.endTime),
				id: obj.bookingId,
				location: obj.pickupAddress || 'No location provided',
				color: obj.backgroundColorRGB || '#2196F3', // Default color if not provided
				...obj,
			};
		}
		const fetchReq = async function () {
			const response = await fetch(
				'https://abacusonline-001-site1.atempurl.com/api/Bookings/Today',
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();
				const filteredData = data.bookings.map((el) => filterObj(el));
				setData(filteredData);
			} else {
				console.log(response);
			}
		};
		fetchReq();
	}, []);

	if (data.length === 0) return <p>loading...</p>;

	const AppointmentComponent = ({ children, style, ...restProps }) => {
		const { data } = restProps;
		return (
			<Appointments.Appointment
				{...restProps}
				style={{
					...style,
					backgroundColor: data.color,
					borderRadius: '8px',
				}}
			>
				{children}
			</Appointments.Appointment>
		);
	};

	const CustomTooltipContent = ({ appointmentData = {} }) => {
		return (
			<div className='p-5'>
				<h2>{appointmentData.title}</h2>
				<div className='flex justify-between'>
					<p>
						<strong className='text-green-600'>Passenger Name:</strong>{' '}
						{appointmentData.passengerName}
					</p>
					<p>({appointmentData.passengers})</p>
				</div>
				<div className='flex justify-between'>
					<p>
						<strong className='text-green-600'>Pick up:</strong>{' '}
						{appointmentData.pickupAddress}
					</p>
				</div>
				<p>
					<strong className='text-green-600'>Destination Address:</strong>{' '}
					{appointmentData.destinationAddress}
				</p>
				<p>
					<strong className='text-green-600'>Start Date:</strong>{' '}
					{appointmentData.startDate.toString()}
				</p>
				<p>
					<strong className='text-green-600'>End Date:</strong>{' '}
					{appointmentData.endDate.toString()}
				</p>
				<p>
					<strong className='text-green-600'>Fare</strong> $
					{appointmentData.price}
				</p>
				<p>
					<strong className='text-green-600'>Booking ID:</strong>{' '}
					{appointmentData.id}
				</p>
			</div>
		);
	};

	return (
		<Paper>
			<Scheduler
				data={data}
				height={660}
			>
				<ViewState currentDate={currentDate} />
				<EditingState onCommitChanges={commitChanges} />
				<IntegratedEditing />
				<DayView
					startDayHour={0}
					endDayHour={24}
				/>
				<ConfirmationDialog />
				<Appointments appointmentComponent={AppointmentComponent} />
				<AppointmentTooltip
					showOpenButton
					showDeleteButton
					contentComponent={CustomTooltipContent}
				/>
				<AppointmentForm />
			</Scheduler>
		</Paper>
	);
};

export default Demo;
