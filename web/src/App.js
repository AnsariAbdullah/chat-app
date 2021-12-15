import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])
	const [ toggleNameField, setToggleNameField ] = useState(false)

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		e.preventDefault()
		if(!state.name == '' && !state.message == '' ){
			socketRef.current.emit("message", { name, message })
			setState({ message: "", name })
			setToggleNameField(true)
		}else{
			alert('Please enter proper data')
		}
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card">
			<div className="render-chat">
				<h1 className="heading">Chat Log</h1>
				<div className="chat-wrapper">
					{renderChat()}
				</div>
			</div>
			<form onSubmit={onMessageSubmit}>
				{!toggleNameField ? 
					<div className="name-field">
						<input type="text" name="name" onChange={(e) => onTextChange(e)} value={state.name} placeholder="Enter name" />
					</div>
					: null
				}
				<div className="message-wrapper">
					<div className="input-wrapper">
						<input
							type="text" 
							className="message-box"
							name="message"
							onChange={(e) => onTextChange(e)}
							value={state.message}
							placeholder="Message"
						/>
					</div>
					<button className="submit-button">Send</button>
				</div>
			</form>
		</div>
	)
}

export default App

