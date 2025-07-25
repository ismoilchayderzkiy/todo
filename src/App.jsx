import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Button, Modal } from 'antd'
import { Carousel } from 'antd'
import musicFile from './assets/последний старк.mp3'
import './App.css'
import Snowfall from './components/snow'

function App() {
	const api = 'https://to-dos-api.softclub.tj/api/to-dos'
	const apiImage = 'https://to-dos-api.softclub.tj/images'
	const apiStatus = 'https://to-dos-api.softclub.tj/completed'

	const [data, setData] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const audioRef = useRef(null)
	const [audioStarted, setAudioStarted] = useState(false)

	useEffect(() => {
		Get()
		const audio = audioRef.current
		if (audio) {
			audio.volume = 0.9
		}
	}, [])

	async function Get() {
		try {
			let { data } = await axios.get(api)
			setData(data.data)
		} catch (error) {
			console.error(error)
		}
	}
	function handlePlayAudio() {
		const audio = audioRef.current
		if (audio) {
			audio.volume = 0.9
			audio.play()
			setAudioStarted(true)
		}
	}

	async function deleteUser(id) {
		try {
			await axios.delete(`${api}?id=${id}`)
			Get()
		} catch (error) {
			console.error(error)
		}
	}

	async function addUser(e) {
		e.preventDefault()
		const formData = new FormData(e.target)
		try {
			await axios.post(api, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			Get()
			setIsModalOpen(false)
		} catch (error) {
			console.error(error)
		}
	}

	async function editStatus(e) {
		let obj = { ...e, isCompleted: !e.isCompleted }
		try {
			await axios.put(`${apiStatus}?id=${e.id}`, obj)
			Get()
		} catch (error) {
			console.error(error)
		}
	}
	return (
		<>
			<Snowfall />
			{!audioStarted && (
				<button
					onClick={handlePlayAudio}
					className='fixed top-5 right-5 bg-black/70 text-white px-4 py-2 rounded z-50 font-got'
				>
					🔊 Включить музыку
				</button>
			)}

			<audio ref={audioRef} src={musicFile} loop />
			<div className='app-bg min-h-screen py-10 px-4'>
				<div className='overlay-bg'></div>
				<div className='white-walker'></div>
				<div className='direwolf'></div>
				<h1 className='text-center text-white text-4xl font-got mb-10'>
					Tasks of the Realm
				</h1>

				<Button
					type='primary'
					className='block mx-auto mb-10 got-btn'
					onClick={() => setIsModalOpen(true)}
				>
					Add New Task
				</Button>

				<Modal
					title={
						<span className='font-got text-xl text-white'>Add a Task</span>
					}
					open={isModalOpen}
					footer={null}
					onCancel={() => setIsModalOpen(false)}
					className='got-modal'
				>
					<form className='flex flex-col gap-4' onSubmit={addUser}>
						<input
							type='text'
							name='name'
							placeholder='Name'
							className='got-input'
							required
						/>
						<input
							type='text'
							name='description'
							placeholder='Description'
							className='got-input'
							required
						/>
						<input type='file' name='images' className='got-input-file' />
						<button type='submit' className='got-btn'>
							Submit
						</button>
					</form>
				</Modal>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
					{data.map(e => (
						<div
							key={e.id}
							className='got-card backdrop-blur-sm bg-black/40 border border-gray-700 rounded-xl p-4 text-white shadow-xl relative overflow-hidden'
						>
							<div className='absolute inset-0 bg-smoke-pattern opacity-10 pointer-events-none'></div>

							<div className='w-full h-[200px] rounded-md overflow-hidden'>
								<Carousel autoplay autoplaySpeed={3000} dots={false}>
									{e.images.map((el, index) => (
										<img
											key={index}
											src={`${apiImage}/${el.imageName}`}
											alt='img'
											className='w-full h-[200px] object-cover'
										/>
									))}
								</Carousel>
							</div>

							<div className='mt-4 text-center'>
								<h3 className='text-xl font-got'>{e.name}</h3>
								<p className='text-sm text-gray-300'>{e.description}</p>
								<p className='text-sm mt-1'>
									Status:{' '}
									<span
										className={
											e.isCompleted ? 'text-green-400' : 'text-red-500'
										}
									>
										{e.isCompleted ? 'Completed' : 'Incomplete'}
									</span>
								</p>
							</div>

							<div className='flex justify-between mt-4'>
								<Button danger onClick={() => deleteUser(e.id)}>
									Delete
								</Button>
								<Button type='default' onClick={() => editStatus(e)}>
									Toggle Status
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default App
